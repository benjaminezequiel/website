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
const currentPath = ref([]) // Store points for current stroke
let ctx

const props = defineProps({
  baseStorageKey: {
    type: String,
    default: 'website-drawings',
  },
  smoothingFactor: {
    type: Number,
    default: 0.3,
  },
})

const getStorageKey = () => {
  return `${props.baseStorageKey}-${route.path}`
}

onMounted(() => {
  setupCanvas()
  loadDrawings()
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  () => route.path,
  () => {
    loadDrawings()
  },
)

// Handle CTRL+Z
function handleKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault()
    undo()
  }
}

function undo() {
  if (drawingHistory.value.length > 0) {
    drawingHistory.value.pop()
    redrawHistory()
    saveDrawings()
  }
}

// Bezier curve smoothing
function getSmoothLine(points, tension = 0.3) {
  if (points.length < 2) return points

  const result = []
  result.push(points[0])

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2

    const cp1x = p1[0] + (p2[0] - p0[0]) * tension
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension

    result.push([cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]])
  }

  return result
}

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
  currentPath.value = [[x, y]]

  ctx.beginPath()
  ctx.moveTo(x, y)
}

function draw(event) {
  if (!isDrawing.value || !isDrawingEnabled.value) return

  const { x, y } = getCoordinates(event)
  currentPath.value.push([x, y])

  // Clear and redraw current stroke
  redrawHistory()
  drawSmoothLine(currentPath.value, currentColor.value, currentLineWidth.value)
}

function drawSmoothLine(points, color, lineWidth) {
  if (points.length < 2) return

  const smoothPoints = getSmoothLine(points, props.smoothingFactor)

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.moveTo(smoothPoints[0][0], smoothPoints[0][1])

  for (let i = 1; i < smoothPoints.length; i++) {
    const point = smoothPoints[i]
    if (point.length === 2) {
      ctx.lineTo(point[0], point[1])
    } else {
      ctx.bezierCurveTo(point[0], point[1], point[2], point[3], point[4], point[5])
    }
  }

  ctx.stroke()
}

function stopDrawing() {
  if (!isDrawingEnabled.value || !isDrawing.value) return

  if (currentPath.value.length > 1) {
    drawingHistory.value.push({
      color: currentColor.value,
      lineWidth: currentLineWidth.value,
      points: [...currentPath.value],
    })
    saveDrawings()
  }

  isDrawing.value = false
  currentPath.value = []
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
  if (ctx) {
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  }

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
    drawSmoothLine(path.points, path.color, path.lineWidth)
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
      <button @click="undo" title="Undo last stroke (Ctrl+Z)" class="undo-btn">↩️ Undo</button>
    </div>
  </div>
</template>

<style scoped>
.drawing-overlay {
  position: fixed;
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

.clear-btn,
.undo-btn {
  padding: 4px 12px;
  border: none;
  background: #de005d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover,
.undo-btn:hover {
  background: #c0004d;
  transform: translateY(-1px);
}

.undo-btn {
  background: #666;
}

.undo-btn:hover {
  background: #555;
}

input[type='range'] {
  width: 100px;
}
</style>
