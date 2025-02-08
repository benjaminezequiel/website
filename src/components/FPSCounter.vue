<template>
  <span class="welcome__FPS">
    <span>FPS: </span>
    <NumberFlow :value="fps" willchange="true" />
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import NumberFlow from '@number-flow/vue'

const fps = ref(0)
const frames = ref(0)
const lastTime = ref(performance.now())
const rafId = ref(null)
const THROTTLE = 2
const updateFPS = () => {
  if (frames.value++ % THROTTLE === 0) {
    const currentTime = performance.now()

    if (currentTime >= lastTime.value + 1000) {
      fps.value = Math.round((frames.value * 1000) / (currentTime - lastTime.value))
      frames.value = 0
      lastTime.value = currentTime
    }
  }
  rafId.value = requestAnimationFrame(updateFPS)
}

onUpdated(() => {
  console.log('Updated: FPS Counter')
})

onMounted(() => {
  updateFPS()
})

onUnmounted(() => {
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
  }
})
</script>
<style>
.welcome__FPS {
  color: white;
}
</style>
