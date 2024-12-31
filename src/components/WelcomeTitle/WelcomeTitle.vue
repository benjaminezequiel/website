<template>
  <div class="welcome-title" @mouseover="startMove" @mouseleave="resetMove">
    <div class="primary__container">
      <div class="primary__top">
        <img src="/assets/logo/ezben.svg" class="header--logo" />
        <!-- <span class="material-symbols-outlined">rebase_edit</span> -->
        <img src="/assets/barcode_benjamin.svg" class="header--logo" />
        <!-- <span class="material-symbols-outlined">thread_unread</span> -->
        <span class="primary__top-right">
          <span class="welcome__FPS">
            <span>FPS: </span>
            <NumberFlow :value="fps"></NumberFlow>
          </span>
          <span class="text-faint">|</span>
          <span class="welcome__timer">
            <NumberFlow :value="hours" :format="{ minimumIntegerDigits: 2, useGrouping: false }" />
            <span>:</span>
            <NumberFlow
              :value="minutes"
              :format="{ minimumIntegerDigits: 2, useGrouping: false }"
            />
            <span>:</span>
            <NumberFlow
              :value="seconds"
              :format="{ minimumIntegerDigits: 2, useGrouping: false }"
            />
          </span>
        </span>
      </div>
      <div ref="primaryTitle" class="primary__title">WELCOME</div>
      <div class="primary__bottom">
        <!-- <button>INTRO MESSAGE</button> -->
        <!-- <span class="material-symbols-outlined">polyline</span> -->
        <!-- <span class="material-symbols-outlined">place</span> -->
        <span>PORTO ALEGRE, BRAZIL</span>
        <!-- <img src="/assets/heatmap.svg" class="heatmap" /> -->
        <span class="welcome__resolution">
          <span> X </span>
          <NumberFlow :value="width"></NumberFlow>
          <span> Y </span>
          <NumberFlow :value="height"></NumberFlow>
        </span>
      </div>
    </div>
    <div class="secondary" ref="secondary_title"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NumberFlow from '@number-flow/vue'

const fps = ref(0)
const frames = ref(0)
const lastTime = ref(performance.now())
const rafId = ref(null)

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

const updateResolution = () => {
  width.value = window.innerWidth
  height.value = window.innerHeight
}

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let timer = null
let timerInterval

const updateTime = () => {
  const now = new Date()
  hours.value = now.getHours()
  minutes.value = now.getMinutes()
  seconds.value = now.getSeconds()
}

const updateFPS = () => {
  frames.value++
  const currentTime = performance.now()

  if (currentTime >= lastTime.value + 1000) {
    fps.value = Math.round((frames.value * 1000) / (currentTime - lastTime.value))
    frames.value = 0
    lastTime.value = currentTime
  }

  rafId.value = requestAnimationFrame(updateFPS)
}

const primaryTitle = ref(null)
const secondary_title = ref(null)
let randomMoveId

onMounted(() => {
  updateBgLetters()
  window.addEventListener('resize', updateResolution)

  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  timer = setInterval(updateTime, 1000)

  updateFPS()
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('resize', updateResolution)
  if (timerInterval) clearInterval(timerInterval)
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
  }
})

function updateBgLetters() {
  const text = primaryTitle.value.innerHTML
  for (let i = 0; i < text.length; i++) {
    let letter = document.createElement('span')
    letter.innerHTML = text[i]
    letter.style.display = 'inline-block'
    secondary_title.value.appendChild(letter)
  }
}

function startMove() {
  secondary_title.value.style.gap = '2px'

  if (randomMoveId == undefined) {
    randomMoveId = setInterval(() => {
      for (let i = 0; i < primaryTitle.value.innerHTML.length; i++) {
        let letter = secondary_title.value.children[i]
        let random_x = (Math.random() * 2 - 1) * 2
        let random_y = (Math.random() * 2 - 1) * 8
        let random_angle = (Math.random() * 2 - 1) * 10
        let style =
          'translate(' +
          random_x +
          'px' +
          ',' +
          random_y +
          'px' +
          ')' +
          'rotate(' +
          random_angle +
          'deg' +
          ')'

        letter.style.transform = style
      }
    }, 300)
  }
}

function resetMove() {
  for (let i = 0; i < primaryTitle.value.innerHTML.length; i++) {
    let letter = secondary_title.value.children[i]
    letter.style.transform = 'unset'
  }
  secondary_title.value.style.gap = '0px'
  clearInterval(randomMoveId)
  randomMoveId = undefined
}
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
