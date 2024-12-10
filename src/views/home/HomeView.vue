<script>
import AsciiComponent from '../../components/AsciiComponent.vue'
import { azimuth } from '../../components/AsciiComponent.vue'
import NumberFlow from '@number-flow/vue'
</script>
<template>
  <div class="page--container">
    <div class="page">
      <header class="header">
        <img src="/assets/logo/full_logo.svg" alt="" class="header--logo" />
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
        </div>
      </header>
      <div class="content">
        <AsciiComponent
          ref="asciiB"
          class="ascii"
          :class="expanded ? 'expanded' : ''"
        ></AsciiComponent>
        <div
          class="welcome_section"
          @mouseover="startMove"
          @mouseleave="resetMove"
          @click="handleWelcomeClick"
        >
          <div class="welcome_component">
            <div class="primary" ref="primary_title">WELCOME</div>
            <div class="secondary" ref="secondary_title"></div>
          </div>
        </div>
      </div>

      <!-- <span> | </span>
      <span>DEGREES: </span>
      <span>{{ azimuth }}</span> -->
      <!-- <span>LAST SECOND BRAIN STATUS:</span>
      <span>7 days ago, 2304 notes, 300.000 words</span> -->
      <!-- <div class="message">
        <header>
          <span>ICON</span>
          HEY THERE!
        </header>
        <section>
          I'm really glad you made it here. Feel free to explore my projects, read some thoughts, or
          just say hi. I hope you find something that inspires you!
        </section>
      </div> -->

      <!-- <div class="highlights">
        <header>HIGHLIGHTS</header>
        <section>
          <article v-for="item in highlights" :key="item.slug" class="">
            <RouterLink
              class="highlight_item"
              :to="{ name: item.type, params: { slug: item.slug } }"
            >
              <h3>{{ item.title }}</h3>
              <span class="highlight_type">{{ item.type }}</span>
            </RouterLink>
          </article>
        </section>
      </div>
      <div class="shortcuts">
        <header>SHORCUTS</header>
        <section>
          <div>
            <span>COPY</span>
            <span>CTRL + V</span>
          </div>
          <div>
            <span>GLOBAL SEARCH</span>
            <span>CTRL + K</span>
          </div>
        </section>
      </div> -->
    </div>

    <div class="nav" :class="navIsOpen ? '' : 'hidden'">
      <div
        class="nav__hidden-area"
        @click="
          () => {
            navIsOpen = true
          }
        "
        v-if="!navIsOpen"
      ></div>
      <RouterLink class="nav__item current_page" to="/">
        <span class="nav__item-icon material-symbols-outlined">home</span>
        <span class="nav__item-label">HOME</span>
      </RouterLink>
      <RouterLink class="nav__item" to="/projects">
        <span class="nav__item-icon material-symbols-outlined"> design_services</span>
        <span class="nav__item-label">PROJECTS</span>
      </RouterLink>
      <RouterLink class="nav__item" to="/field_notes">
        <span class="nav__item-icon material-symbols-outlined"> description </span>
        <span class="nav__item-label">NOTES</span>
      </RouterLink>
      <RouterLink class="nav__item" to="/experiments">
        <span class="nav__item-icon material-symbols-outlined"> thread_unread </span>
        <span class="nav__item-label">EXPERIMENTS</span>
      </RouterLink>
      <RouterLink class="nav__item" to="/about">
        <span class="nav__item-icon material-symbols-outlined"> sentiment_satisfied </span>
        <span class="nav__item-label">ABOUT ME</span>
      </RouterLink>
      <!-- <div
        class="nav__hide"
        @click="
          () => {
            if (navIsOpen) navIsOpen = false
          }
        "
      >
        <span class="material-symbols-outlined">close</span>
      </div> -->
    </div>
    <!-- <section class="recent-content">
      <h2>RECENTLY ADDED</h2>
      <div class="content-grid"></div>
    </section>
    <section class="highlights">
      <h2>HIGHLIGHTS</h2>
      <div class="highlights-grid">
        <article v-for="item in highlights" :key="item.slug" class="highlight-card">
          <RouterLink :to="{ name: item.type, params: { slug: item.slug } }">
            <span class="content-type">{{ formatContentType(item.type) }}</span>
            <h3>{{ item.title }}</h3>
            <p v-if="item.description" class="description">{{ item.description }}</p>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </RouterLink>
        </article>
      </div>
    </section> -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { getContent } from '@/utils/content'

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

const primary_title = ref(null)
const secondary_title = ref(null)
let randomMoveId

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

const updateResolution = () => {
  width.value = window.innerWidth
  height.value = window.innerHeight
}

const navIsOpen = ref(true)
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

let timerInterval

onMounted(() => {
  updateBgLetters()
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

function updateBgLetters() {
  const text = primary_title.value.innerHTML
  for (let i = 0; i < text.length; i++) {
    let letter = document.createElement('span')
    letter.innerHTML = text[i]
    letter.style.display = 'inline-block'
    secondary_title.value.appendChild(letter)
  }
}

function startMove() {
  secondary_title.value.style.gap = '2px'
  console.log(randomMoveId)
  if (randomMoveId == undefined) {
    randomMoveId = setInterval(() => {
      for (let i = 0; i < primary_title.value.innerHTML.length; i++) {
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
  for (let i = 0; i < primary_title.value.innerHTML.length; i++) {
    let letter = secondary_title.value.children[i]
    letter.style.transform = 'unset'
  }
  secondary_title.value.style.gap = '0px'
  clearInterval(randomMoveId)
  randomMoveId = undefined
}

const recentItems = ref([])

onMounted(async () => {
  const [projects, posts, experiments] = await Promise.all([
    getContent('projects'),
    getContent('field-notes'),
    getContent('experiments'),
  ])

  const allItems = [
    ...projects.map((p) => ({ ...p, type: 'project' })),
    ...posts.map((p) => ({ ...p, type: 'note' })),
    ...experiments.map((e) => ({ ...e, type: 'experiment' })),
  ]

  recentItems.value = allItems.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
})

const highlights = ref([])

onMounted(async () => {
  const [projects, notes, experiments] = await Promise.all([
    getContent('projects'),
    getContent('field-notes'),
    getContent('experiments'),
  ])

  const allHighlights = [
    ...projects.map((p) => ({ ...p, type: 'project' })),
    ...notes.map((n) => ({ ...n, type: 'note' })),
    ...experiments.map((e) => ({ ...e, type: 'experiment' })),
  ]
    .filter((item) => item.highlight)
    .sort((a, b) => (a.highlightOrder || 99) - (b.highlightOrder || 99))

  highlights.value = allHighlights

  const allItems = [
    ...projects.map((p) => ({ ...p, type: 'project' })),
    ...notes.map((n) => ({ ...n, type: 'note' })),
    ...experiments.map((e) => ({ ...e, type: 'experiment' })),
  ].filter((item) => !item.highlight)
  recentItems.value = allItems.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
})

const expanded = ref(true)

const handleWelcomeClick = () => {
  if (expanded.value) {
    expanded.value = false
    return
  }
  expanded.value = true
}
</script>

<style scoped lang="scss">
@use './home.scss';

.page.compact {
  width: 30%;
  height: 60%;
}
</style>
