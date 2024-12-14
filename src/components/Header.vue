<template>
  <header class="header">
    <a href="/">
      <img src="/assets/logo/full_logo.svg" alt="" class="header--logo" />
    </a>
    <div class="header--system_info">
      <span>
        <span>FPS: </span>
        <NumberFlow :value="fps"></NumberFlow>
      </span>
      <span class="divider"> | </span>
      <span>
        <NumberFlow :value="width"></NumberFlow>
        <span> x </span>
        <NumberFlow :value="height"></NumberFlow>
      </span>
      <span class="divider"> | </span>
      <span>
        <NumberFlow :value="hours" :format="{ minimumIntegerDigits: 2, useGrouping: false }" />
        <span>:</span>
        <NumberFlow :value="minutes" :format="{ minimumIntegerDigits: 2, useGrouping: false }" />
        <span>:</span>
        <NumberFlow :value="seconds" :format="{ minimumIntegerDigits: 2, useGrouping: false }" />
      </span>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import NumberFlow from '@number-flow/vue'

const fps = ref(0)
const frames = ref(0)
const lastTime = ref(performance.now())
const rafId = ref(null)

const updateFPS = () => {
  frames.value++
  const currentTime = performance.now()

  if (currentTime >= lastTime.value + 1000) {
    // Fixed: removed 'this' and added .value
    fps.value = Math.round((frames.value * 1000) / (currentTime - lastTime.value)) // Fixed: added .value
    frames.value = 0
    lastTime.value = currentTime
  }

  rafId.value = requestAnimationFrame(updateFPS)
}

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let timer = null

const updateTime = () => {
  const now = new Date()
  hours.value = now.getHours()
  minutes.value = now.getMinutes()
  seconds.value = now.getSeconds()
}

const updateResolution = () => {
  width.value = window.innerWidth
  height.value = window.innerHeight
}

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

let timerInterval

onMounted(() => {
  window.addEventListener('resize', updateResolution)
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  updateFPS()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('resize', updateResolution)
  if (timerInterval) clearInterval(timerInterval)
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
  }
})
</script>

<style lang="scss">
@use '../styles/utils.scss' as utils;

.header {
  position: absolute;
  // background-color: rgba(255, 0, 0, 0.361);
  width: 100%;
  top: 0;
  align-items: flex-start;
  justify-content: space-between;
  display: flex;
  padding: var(--fluid-space) var(--fluid-space) 0 var(--fluid-space);

  .header--logo {
    max-width: max(10vw, 120px);
    transition: var(--ease-out) scale 200ms;
    &:hover {
      scale: 1.02;
    }
  }

  .header--system_info {
    @include utils.prevent-select;

    text-wrap: nowrap;
    font-variant-numeric: tabular-nums;
    display: flex;
    gap: 12px;
    width: fit-content;
    color: var(--gray-900);

    .divider {
      color: var(--gray-500);
    }
  }
}

@media (max-width: 800px) {
  .header {
    justify-content: space-between;

    .header--system_info {
      flex-direction: column;
      gap: 0px;
      align-items: flex-end;

      .divider {
        display: none;
      }

      span:not(:first-child) {
        margin-top: -4px;
      }
    }
  }
}
</style>
