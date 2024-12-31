<template>
  <div class="vAscii__wrapper">
    <div class="vAscii__render-container">
      <div ref="refRenderContainer" class="vAscii__threejs"></div>
      <pre class="vAscii__char-output">{{ asciiFrame }}</pre>
    </div>
    <div v-if="showDebug" class="vAscii__debug-container">
      <div ref="refDebugContainer" class="vAscii__debug-renderer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw, shallowRef } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Core three.JS variables
let scene = null
let camera = null
let renderer = null
let model = null
let controls = null

// Cofig constants
const WIDTH = 160
const HEIGHT = 50
const RENDER_WIDTH = 512
const RENDER_HEIGHT = 256
const ASCII_CHARS = ' .:-=+*#%@'

// Setup canvas
const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d', { willReadFrequently: true })

// DOM refs
const refRenderContainer = ref(null)
const refDebugContainer = ref(null)

// Performance stuff
const asciiLookup = new Array(256)
for (let i = 0; i < 256; i++) {
  asciiLookup[i] = ASCII_CHARS[Math.floor((i / 255) * (ASCII_CHARS.length - 1))]
}

// Reactive stuff
const isUserInteracting = ref(false)
const isModelLoaded = ref(false)
const asciiFrame = ref('')
const showDebug = ref(true)

// Rotation variables
const polar = ref(0)
const distance = ref(0)
const azimuth = ref(0)

onMounted(async () => {
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
  camera = new THREE.PerspectiveCamera(10, RENDER_WIDTH / RENDER_HEIGHT, 0.1, 1000)
  camera.position.z = 60

  // Main renderer
  renderer = new THREE.WebGLRenderer({
    antialias: false,
  })
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT)
  refRenderContainer.value.appendChild(renderer.domElement)

  // Debug renderer
  if (showDebug.value && refDebugContainer.value) {
    const debugRenderer = markRaw(
      new THREE.WebGLRenderer({
        antialias: false,
      }),
    )
    debugRenderer.setSize(320, 160)
    refDebugContainer.value.appendChild(debugRenderer.domElement)
    renderer.debugRenderer = debugRenderer
  }
}

const initControls = (element) => {
  controls = new OrbitControls(camera, element)

  Object.assign(controls, {
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

  controls.target.set(0.2, 0, 0.5)
  controls.addEventListener('start', () => (isUserInteracting.value = true))
  controls.addEventListener('end', () => (isUserInteracting.value = false))
}

const loadModel = async () => {
  if (isModelLoaded.value) return

  const loader = new OBJLoader()
  try {
    const object = await new Promise((resolve, reject) => {
      loader.load('/assets/object_to_ascii.obj', resolve, undefined, reject)
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
    new THREE.AmbientLight(0xffffff, 0.05),
    new THREE.DirectionalLight(0xffffff, 2),
    new THREE.DirectionalLight(0xffffff, 5),
  ]

  lights[1].position.set(1, 1, 1)
  lights[2].position.set(0, 10, 0)

  lights.forEach((light) => scene.add(light))
}

let animationFrameId

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  controls.update()
  updateCameraPosition()
  asciiFrame.value = frameToAscii()
}

const frameToAscii = () => {
  const startTime = performance.now()

  renderer.render(scene, camera)
  if (showDebug.value && renderer.debugRenderer) {
    renderer.debugRenderer.render(scene, camera)
  }

  // ASCII conversion
  ctx.drawImage(renderer.domElement, 0, 0, WIDTH, HEIGHT)
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

      const grayScale = (pixels[idx] * 299 + pixels[idx + 1] * 587 + pixels[idx + 2] * 114) >> 10
      result += asciiLookup[grayScale]
    }
    result += '\n'
  }

  return result
}

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
