<template>
  <div class="wrapper">
    <div class="model-container">
      <div ref="mainContainer" class="threejs-container"></div>
      <pre class="ascii-art" :style="{ cursor: isUserInteracting ? 'grabbing' : 'grab' }">{{
        asciiFrame
      }}</pre>
    </div>
    <div v-if="showDebug" class="debug-view">
      <div ref="debugContainer" class="debug-renderer"></div>
      <div class="debug-info">
        <p>FPS: {{ fps }}</p>
        <p>Resolution: {{ RENDER_WIDTH }}x{{ RENDER_HEIGHT }}</p>
        <p>ASCII Size: {{ WIDTH }}x{{ HEIGHT }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export const azimuth = ref(0)
</script>
<script setup>
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref, onMounted, onUnmounted, markRaw, shallowRef } from 'vue'

// Use shallowRef for large objects
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const model = shallowRef(null)
const controls = shallowRef(null)

const mainContainer = ref(null)
const debugContainer = ref(null)
const isModelLoaded = ref(false)
const asciiFrame = ref('')
const isUserInteracting = ref(false)
const fps = ref(0)
const lastFrameTime = ref(performance.now())
const frameCount = ref(0)
const showDebug = ref(false)

const polar = ref(0)
const distance = ref(0)

const updateCameraPosition = () => {
  if (camera.value && controls.value) {
    // Get camera position relative to the target
    const position = new THREE.Vector3()
    position.copy(camera.value.position)
    position.sub(controls.value.target)

    // Calculate spherical coordinates
    const spherical = new THREE.Spherical()
    spherical.setFromVector3(position)

    // Convert to degrees and round values
    azimuth.value = Math.floor(THREE.MathUtils.radToDeg(spherical.theta))
    polar.value = Math.round(THREE.MathUtils.radToDeg(spherical.phi) * 100) / 100
    distance.value = Math.round(spherical.radius * 100) / 100
  }
}

// Constants
const WIDTH = 160 // Reduced from 200
const HEIGHT = 50 // Reduced from 65
const RENDER_WIDTH = 512 // Reduced from 640
const RENDER_HEIGHT = 256 // Reduced from 320
const ASCII_CHARS = ' .:-=+*#%@'
const FPS_UPDATE_INTERVAL = 1000 // Update FPS every second

// Reusable objects
const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d', { willReadFrequently: true })
const asciiLookup = new Array(256)
for (let i = 0; i < 256; i++) {
  asciiLookup[i] = ASCII_CHARS[Math.floor((i / 255) * (ASCII_CHARS.length - 1))]
}

const loadModel = async () => {
  if (isModelLoaded.value) return

  const loader = new OBJLoader()
  try {
    const object = await new Promise((resolve, reject) => {
      loader.load('/assets/object_to_ascii.obj', resolve, undefined, reject)
    })

    model.value = markRaw(object)

    const lights = [
      new THREE.AmbientLight(0xffffff, 0.05),
      new THREE.DirectionalLight(0xffffff, 2),
      new THREE.DirectionalLight(0xffffff, 5),
    ]

    lights[1].position.set(1, 1, 1)
    lights[2].position.set(0, 10, 0)

    lights.forEach((light) => scene.value.add(light))
    scene.value.add(object)
    isModelLoaded.value = true
  } catch (error) {
    console.error('Error loading model:', error)
  }
}

const initThreeJs = () => {
  scene.value = markRaw(new THREE.Scene())
  camera.value = markRaw(new THREE.PerspectiveCamera(45, RENDER_WIDTH / RENDER_HEIGHT, 0.1, 1000))
  camera.value.position.z = 15

  renderer.value = markRaw(
    new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
    }),
  )
  renderer.value.setSize(RENDER_WIDTH, RENDER_HEIGHT)

  const rendererElement = renderer.value.domElement
  mainContainer.value.appendChild(rendererElement)

  if (showDebug.value && debugContainer.value) {
    debugContainer.value.appendChild(rendererElement.cloneNode(true))
  }

  initControls(rendererElement)
}

const initControls = (element) => {
  controls.value = markRaw(new OrbitControls(camera.value, element))
  Object.assign(controls.value, {
    enableZoom: false,
    enablePan: false,
    enableDamping: true,
    dampingFactor: 0.02,
    rotateSpeed: 0.25,
    autoRotate: true,
    autoRotateSpeed: 2,
    minPolarAngle: Math.PI / 2,
    maxPolarAngle: Math.PI / 2,
  })

  controls.value.target.set(0.2, 0, 0.5)
  controls.value.addEventListener('start', () => (isUserInteracting.value = true))
  controls.value.addEventListener('end', () => (isUserInteracting.value = false))
}

const frameToAscii = () => {
  renderer.value.render(scene.value, camera.value)
  ctx.drawImage(renderer.value.domElement, 0, 0, WIDTH, HEIGHT)
  const pixels = ctx.getImageData(0, 0, WIDTH, HEIGHT).data
  let result = ''

  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const idx = (i * WIDTH + j) * 4
      const alpha = pixels[idx + 3]

      if (alpha < 128) {
        result += ' '
        continue
      }

      const grayScale = Math.floor(
        0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2],
      )
      result += asciiLookup[grayScale]
    }
    result += '\n'
  }

  return result
}

const updateFPS = () => {
  const now = performance.now()
  frameCount.value++

  if (now - lastFrameTime.value >= FPS_UPDATE_INTERVAL) {
    fps.value = Math.round((frameCount.value * 1000) / (now - lastFrameTime.value))
    frameCount.value = 0
    lastFrameTime.value = now
  }
}

let animationFrameId
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  controls.value?.update()
  updateCameraPosition()
  asciiFrame.value = frameToAscii()

  updateFPS()
}

onMounted(async () => {
  initThreeJs()
  await loadModel()
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  renderer.value?.dispose()
  controls.value?.dispose()
})
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.model-container {
  position: relative;
  width: fit-content;
  margin: 0 auto;
}

.threejs-container {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    scale: 2;
  }
}

.ascii-art {
  font-family: 'Space Mono';
  font-size: 10px;
  line-height: 1;
  white-space: pre;
  user-select: none;
  &:active {
    cursor: grabbing;
  }
}

.debug-view {
  border: 1px solid #666;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
}

.debug-renderer {
  width: 320px;
  height: 160px;
  background: #000;
}

.debug-info {
  margin-top: 10px;
  font-size: 12px;
  color: #fff;
  font-family: monospace;
}

.threejs-container {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}
</style>
