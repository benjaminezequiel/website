<template>
  <div class="wrapper">
    <!-- ASCII View -->
    <div class="model-container">
      <div ref="mainContainer" class="threejs-container"></div>
      <pre class="ascii-art" :style="{ cursor: isUserInteracting ? 'grabbing' : 'grab' }">
        {{ asciiFrame }}
      </pre>
    </div>

    <!-- Debug View -->
    <div v-if="showDebug" class="debug-view">
      <div ref="debugContainer" class="debug-renderer"></div>
      <div class="debug-info">
        <p>FPS: {{ FPS }}</p>
        <p>Resolution: {{ RENDER_WIDTH }}x{{ RENDER_HEIGHT }}</p>
        <p>ASCII Size: {{ WIDTH }}x{{ HEIGHT }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref, onMounted, onUnmounted, markRaw } from 'vue'
const showDebug = ref(false) // You can toggle this with a button if you want

const mainContainer = ref(null)
const debugContainer = ref(null)
const scene = ref(null)
const camera = ref(null)
const renderer = ref(null)
const model = ref(null)
const controls = ref(null)
const isModelLoaded = ref(false)
const asciiFrame = ref('')

const WIDTH = 200
const HEIGHT = 65
const RENDER_WIDTH = 640
const RENDER_HEIGHT = 320
const isUserInteracting = ref(false)

const ASCII_CHARS = ' .:-=+*#%@'

const loadModel = () => {
  if (isModelLoaded.value) {
    console.log('Model already loaded, skipping...')
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const loader = new OBJLoader()

    loader.load(
      'src/assets/object_to_ascii.obj',
      (object) => {
        console.log('Model loaded successfully')
        object.position.set(0.5, 0, 0)
        model.value = markRaw(object)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
        scene.value.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.position.set(1, 1, 1)
        scene.value.add(directionalLight)

        const secondaryLight = new THREE.DirectionalLight(0xffffff, 5)
        secondaryLight.position.set(0, 10, 0)
        scene.value.add(secondaryLight)

        scene.value.add(object)
        isModelLoaded.value = true
        resolve(object)
      },
      (error) => {
        console.error('Error loading model:', error)
        reject(error)
      },
    )
  })
}

const initThreeJs = () => {
  scene.value = markRaw(new THREE.Scene())

  camera.value = markRaw(new THREE.PerspectiveCamera(45, RENDER_WIDTH / RENDER_HEIGHT, 0.1, 1000))
  camera.value.position.z = 15

  renderer.value = markRaw(new THREE.WebGLRenderer())
  renderer.value.setSize(RENDER_WIDTH, RENDER_HEIGHT)

  const rendererElement = renderer.value.domElement
  rendererElement.style.position = 'absolute'
  rendererElement.style.cursor = 'grab'
  rendererElement.style.touchAction = 'none'

  mainContainer.value.appendChild(rendererElement)

  if (showDebug.value && debugContainer.value) {
    debugContainer.value.appendChild(rendererElement.cloneNode(true))
  }

  controls.value = markRaw(new OrbitControls(camera.value, rendererElement))
  controls.value.enableZoom = false
  controls.value.enablePan = false
  controls.value.enableDamping = true
  controls.value.target.set(0.2, 0, 0.5)
  controls.value.dampingFactor = 0.02
  controls.value.rotateSpeed = 0.25
  controls.value.autoRotate = true
  controls.value.autoRotateSpeed = 2
  controls.value.minPolarAngle = Math.PI / 2 // 90 degrees
  controls.value.maxPolarAngle = Math.PI / 2 // 90 degrees

  controls.value.addEventListener('start', () => {
    isUserInteracting.value = true
    rendererElement.style.cursor = 'grabbing'
  })

  controls.value.addEventListener('end', () => {
    isUserInteracting.value = false
    rendererElement.style.cursor = 'grab'
  })
  // Rest of your controls setup...
}
const getAsciiFromGrayScale = (grayScale) => {
  return ASCII_CHARS[Math.floor(grayScale * (ASCII_CHARS.length - 1))]
}

const frameToAscii = () => {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')

  renderer.value.render(scene.value, camera.value)
  ctx.drawImage(renderer.value.domElement, 0, 0, WIDTH, HEIGHT)

  const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
  const pixels = imageData.data

  let result = ''

  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const idx = (i * WIDTH + j) * 4
      const r = pixels[idx]
      const g = pixels[idx + 1]
      const b = pixels[idx + 2]
      const a = pixels[idx + 3]

      if (a < 128) {
        result += ' '
        continue
      }

      const grayScale = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      result += getAsciiFromGrayScale(grayScale)
    }
    result += '\n'
  }

  return result
}

const animate = () => {
  requestAnimationFrame(animate)

  if (controls.value) {
    controls.value.update()
  }

  asciiFrame.value = frameToAscii()
}

onMounted(() => {
  initThreeJs()
  loadModel()
  animate()
})

onUnmounted(() => {
  if (renderer.value) {
    renderer.value.dispose()
    renderer.value.domElement.remove()
  }
})
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
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

/* Update threejs-container to be visible in debug mode */
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
  z-index: 1;
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
}

/* Cursor style when dragging */
.ascii-art:active {
  cursor: grabbing;
}
</style>
