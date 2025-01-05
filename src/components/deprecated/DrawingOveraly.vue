<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const canvas = ref(null)
const isDrawing = ref(false)
const isDrawingEnabled = ref(false)
const currentColor = ref('#DE005D')
const currentLineWidth = ref(2)
const drawingHistory = ref([])
const canvasWidth = ref(window?.innerWidth || 1920)
const canvasHeight = ref(window?.innerHeight || 1080)
let ctx

const props = defineProps({
  baseStorageKey: {
    type: String,
    default: 'website-drawings',
  },
})

// Generate storage key based on current route
const getStorageKey = () => {
  return `${props.baseStorageKey}-${route.path}`
}

onMounted(() => {
  setupCanvas()
  loadDrawings()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Watch for route changes to load different drawings
watch(
  () => route.path,
  () => {
    loadDrawings()
  },
)

function setupCanvas() {
  const canvasElement = canvas.value
  ctx = canvasElement.getContext('2d')

  setCanvasSize()

  canvasElement.addEventListener('mousedown', startDrawing)
  canvasElement.addEventListener('mousemove', draw)
  canvasElement.addEventListener('mouseup', stopDrawing)
  canvasElement.addEventListener('mouseleave', stopDrawing)

  canvasElement.addEventListener('touchstart', handleTouch)
  canvasElement.addEventListener('touchmove', handleTouch)
  canvasElement.addEventListener('touchend', stopDrawing)
}

function setCanvasSize() {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

function handleResize() {
  setCanvasSize()
  redrawHistory()
}

function startDrawing(event) {
  if (!isDrawingEnabled.value) return
  isDrawing.value = true
  const { x, y } = getCoordinates(event)
  ctx.beginPath()
  ctx.moveTo(x, y)

  drawingHistory.value.push({
    color: currentColor.value,
    lineWidth: currentLineWidth.value,
    points: [[x, y]],
  })
}

function draw(event) {
  if (!isDrawing.value || !isDrawingEnabled.value) return

  const { x, y } = getCoordinates(event)

  ctx.lineTo(x, y)
  ctx.strokeStyle = currentColor.value
  ctx.lineWidth = currentLineWidth.value
  ctx.lineCap = 'round'
  ctx.stroke()

  const currentPath = drawingHistory.value[drawingHistory.value.length - 1]
  currentPath.points.push([x, y])
}

function stopDrawing() {
  if (!isDrawingEnabled.value) return
  isDrawing.value = false
  saveDrawings()
}

function getCoordinates(event) {
  const rect = canvas.value.getBoundingClientRect()
  if (event.type.includes('touch')) {
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top,
    }
  }
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function handleTouch(event) {
  event.preventDefault()
  const touch = event.type === 'touchstart' ? startDrawing : draw
  touch(event)
}

function saveDrawings() {
  localStorage.setItem(getStorageKey(), JSON.stringify(drawingHistory.value))
}

function loadDrawings() {
  // Clear canvas first
  if (ctx) {
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  }

  // Load drawings for current route
  const savedDrawings = localStorage.getItem(getStorageKey())
  if (savedDrawings) {
    drawingHistory.value = JSON.parse(savedDrawings)
    redrawHistory()
  } else {
    drawingHistory.value = []
  }
}

function redrawHistory() {
  if (!ctx) return

  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  drawingHistory.value.forEach((path) => {
    ctx.beginPath()
    ctx.strokeStyle = path.color
    ctx.lineWidth = path.lineWidth
    ctx.lineCap = 'round'

    const [firstPoint, ...remainingPoints] = path.points
    if (firstPoint) {
      ctx.moveTo(firstPoint[0], firstPoint[1])

      remainingPoints.forEach((point) => {
        ctx.lineTo(point[0], point[1])
      })

      ctx.stroke()
    }
  })
}

function clearDrawings() {
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  drawingHistory.value = []
  saveDrawings()
}

function toggleDrawing() {
  isDrawingEnabled.value = !isDrawingEnabled.value
}
</script>

<template>
  <div class="drawing-overlay">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      :style="{
        cursor: isDrawingEnabled ? 'crosshair' : 'default',
        pointerEvents: isDrawingEnabled ? 'auto' : 'none',
      }"
    ></canvas>

    <button @click="toggleDrawing" class="toggle-btn" :class="{ active: isDrawingEnabled }">
      {{ isDrawingEnabled ? '✏️ Drawing Mode (Click to Exit)' : '✏️ Start Drawing' }}
    </button>

    <div class="controls" v-show="isDrawingEnabled">
      <input type="color" v-model="currentColor" title="Change color" />
      <input type="range" v-model="currentLineWidth" min="1" max="10" title="Change line width" />
      <button @click="clearDrawings" title="Clear all drawings" class="clear-btn">Clear</button>
    </div>
  </div>
</template>

<style scoped>
.drawing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

canvas {
  transition: cursor 0.2s ease;
}

.toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: white;
  border: 2px solid #de005d;
  color: #de005d;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  pointer-events: auto;
  z-index: 1001;
}

.toggle-btn.active {
  background: #de005d;
  color: white;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(222, 0, 93, 0.2);
}

.controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  z-index: 1001;
}

.clear-btn {
  padding: 4px 12px;
  border: none;
  background: #de005d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover {
  background: #c0004d;
}

input[type='range'] {
  width: 100px;
}
</style>
