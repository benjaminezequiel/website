<template>
  <div class="vAscii__wrapper">
    <div class="vAscii__render-container">
      <div ref="refRenderContainer" class="vAscii__threejs"></div>
      <pre class="vAscii__char-output" ref="asciiOutput"></pre>
    </div>
    <div v-if="showDebug" class="vAscii__debug-container">
      <div ref="refDebugContainer" class="vAscii__debug-renderer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw, computed, watch, onUpdated } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

onUpdated(() => {
  console.log('updated')
})

const props = defineProps({
  modelPath: {
    type: String,
    required: true,
  },
  asciiConfig: {
    type: Object,
    default: () => ({
      width: 160,
      height: 50,
      chars: ' .:-=+*#%@',
      renderWidth: 512,
      renderHeight: 256,
    }),
  },
  cameraConfig: {
    type: Object,
    default: () => ({
      fov: 10,
      near: 0.1,
      far: 1000,
      position: { x: 0, y: 0, z: 60 },
    }),
  },
  controlsConfig: {
    type: Object,
    default: () => ({
      enableZoom: false,
      enablePan: false,
      enableDamping: true,
      dampingFactor: 0.02,
      rotateSpeed: 0.25,
      autoRotate: true,
      autoRotateSpeed: 2,
      minPolarAngle: Math.PI / 2,
      maxPolarAngle: Math.PI / 2,
    }),
  },
  showDebug: {
    type: Boolean,
    default: false,
  },
})

// Cofig constants
const WIDTH = computed(() => props.asciiConfig.width)
const HEIGHT = computed(() => props.asciiConfig.height)
const RENDER_WIDTH = computed(() => props.asciiConfig.renderWidth)
const RENDER_HEIGHT = computed(() => props.asciiConfig.renderHeight)
const ASCII_CHARS = computed(() => props.asciiConfig.chars)

let outsideCanvas
let throttleFactor = 2
let frameCount = 0
let ctx

watch([WIDTH, HEIGHT], ([newWidth, newHeight]) => {
  if (outsideCanvas) {
    outsideCanvas.width = newWidth
    outsideCanvas.height = newHeight
  }
})

let scene = null
let camera = null
let renderer = null
let controls = null
let model = null

// DOM refs
const refRenderContainer = ref(null)
const refDebugContainer = ref(null)

// Reactive stuff
const isUserInteracting = ref(false)
const isModelLoaded = ref(false)

// Rotation variables
// const polar = ref(0)
// const distance = ref(0)
// const azimuth = ref(0)

watch(ASCII_CHARS, () => {
  const newLookup = initAsciiLookup()
  for (let i = 0; i < 256; i++) {
    asciiLookup[i] = newLookup[i]
  }
})

onMounted(async () => {
  resultRows = new Array(HEIGHT.value)

  // if()
  outsideCanvas = document.createElement('canvas')
  outsideCanvas.width = WIDTH.value
  outsideCanvas.height = HEIGHT.value
  ctx = outsideCanvas.getContext('2d', { willReadFrequently: true })

  initThreeJs()
  initControls(renderer.domElement)
  await loadModel()
  setupLights()
  animate()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  renderer.dispose()
  controls.dispose()
})

const initThreeJs = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    props.cameraConfig.fov,
    RENDER_WIDTH.value / RENDER_HEIGHT.value,
    props.cameraConfig.near,
    props.cameraConfig.far,
  )
  camera.position.set(
    props.cameraConfig.position.x,
    props.cameraConfig.position.y,
    props.cameraConfig.position.z,
  )

  renderer = new THREE.WebGLRenderer({
    precision: 'lowp',
    antialias: false,
    powerPreference: 'high-performance',
    depth: false,
  })

  renderer.setSize(RENDER_WIDTH.value, RENDER_HEIGHT.value)
  refRenderContainer.value.appendChild(renderer.domElement)

  if (props.showDebug && refDebugContainer.value) {
    const debugRenderer = new THREE.WebGLRenderer({
      antialias: false,
    })
    debugRenderer.setSize(320, 160)
    refDebugContainer.value.appendChild(debugRenderer.domElement)
    renderer.debugRenderer = debugRenderer
  }
}

watch(
  () => props.controlsConfig,
  (newConfig) => {
    if (controls) {
      Object.assign(controls, newConfig)
      controls.update()
    }
  },
  { deep: true },
)

const initControls = (element) => {
  controls = new OrbitControls(camera, element)
  const finalConfig = {
    enableZoom: false,
    enablePan: false,
    enableDamping: true,
    dampingFactor: 0.02,
    rotateSpeed: 0.25,
    autoRotate: true,
    autoRotateSpeed: 2,
    minPolarAngle: Math.PI / 2,
    maxPolarAngle: Math.PI / 2,
    ...props.controlsConfig, // This will override only the provided values
  }
  Object.assign(controls, finalConfig)
  controls.target.set(0.2, 0, 0.5)
  controls.update()

  controls.addEventListener('start', () => (isUserInteracting.value = true))
  controls.addEventListener('end', () => (isUserInteracting.value = false))
}

const loadModel = async () => {
  if (isModelLoaded.value) return

  const loader = new OBJLoader()
  try {
    const object = await new Promise((resolve, reject) => {
      loader.load(props.modelPath, resolve, undefined, reject)
    })

    model = object
    scene.add(object)
    isModelLoaded.value = true
  } catch (error) {
    console.error('Error loading model:', error)
  }
}

const setupLights = () => {
  const lights = [
    new THREE.AmbientLight(0xffffff, 0.2),
    new THREE.DirectionalLight(0xffffff, 10),
    new THREE.DirectionalLight(0xffffff, 2),
  ]

  lights[1].position.set(15, 20, 0)
  lights[2].position.set(-20, 10, 0)

  lights.forEach((light) => scene.add(light))
}

let animationFrameId

const asciiOutput = ref(null)

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  // updateCameraPosition()
  if (frameCount++ % throttleFactor === 0) {
    controls.update()
    asciiOutput.value.textContent = frameToAscii()
  }
}

let resultRows
const frameToAscii = () => {
  renderer.render(scene, camera)

  // if (props.showDebug && renderer.debugRenderer) {
  //   renderer.debugRenderer.render(scene, camera)
  // }

  // if (!canvas.value || !ctx.value) return ''

  ctx.drawImage(renderer.domElement, 0, 0, WIDTH.value, HEIGHT.value)
  const pixels = ctx.getImageData(0, 0, WIDTH.value, HEIGHT.value).data

  for (let i = 0; i < HEIGHT.value; i++) {
    const row = new Array(WIDTH.value)
    const rowOffset = i * WIDTH.value * 4

    for (let j = 0; j < WIDTH.value; j++) {
      const idx = rowOffset + j * 4

      if (pixels[idx + 3] < 128) {
        row[j] = ' '
        continue
      }

      const grayScale = (pixels[idx] * 299 + pixels[idx + 1] * 587 + pixels[idx + 2] * 114) >> 10
      row[j] = asciiLookup[grayScale]
    }
    resultRows[i] = row.join('')
  }
  return resultRows.join('\n')
}

const initAsciiLookup = () => {
  const lookup = new Array(256)
  for (let i = 0; i < 256; i++) {
    lookup[i] = ASCII_CHARS.value[Math.floor((i / 255) * (ASCII_CHARS.value.length - 1))]
  }
  return lookup
}

const asciiLookup = initAsciiLookup()

const updateCameraPosition = () => {
  if (camera && controls) {
    const position = new THREE.Vector3()
    position.copy(camera.position)
    position.sub(controls.target)

    const spherical = new THREE.Spherical()
    spherical.setFromVector3(position)

    azimuth.value = Math.floor(THREE.MathUtils.radToDeg(spherical.theta))
    polar.value = Math.round(THREE.MathUtils.radToDeg(spherical.phi) * 100) / 100
    distance.value = Math.round(spherical.radius * 100) / 100
  }
}
</script>

<style scoped lang="scss">
@use './styles.scss';
</style>
