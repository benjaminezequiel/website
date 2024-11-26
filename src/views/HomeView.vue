<script>
import AsciiComponent from '../components/AsciiComponent.vue'
import asciiBg from '@/components/asciiBg.vue'
</script>
<template>
  <div class="page">
    <AsciiComponent ref="asciiB" class="ascii" :class="expanded ? 'expanded' : ''"></AsciiComponent>
    <div class="system_info" :class="expanded ? 'jump' : 'hide'">
      FPS: {{ fps }} | {{ width }} x {{ height }} | {{ formatTime(currentTime) }}
    </div>
    <div class="welcome">
      <div class="primary" ref="primary_title">WELCOME</div>
      <div
        class="secondary"
        ref="secondary_title"
        @mouseover="startMove"
        @mouseleave="resetMove"
        @click="handleWelcomeClick"
      ></div>
    </div>
    <div class="window" :class="expanded ? 'jump' : 'hide'">
      <header>HEY THERE!</header>
      <section>
        I'm really glad you made it here. Feel free to explore my projects, read some thoughts, or
        just say hi. I hope you find something that inspires you!
      </section>
    </div>
    <div class="window projects" :class="expanded ? 'jump' : 'hide'">
      <header>AREAS</header>
      <section>
        <RouterLink class="router_button" to="/projects">[ PROJECTS ]</RouterLink>
        <RouterLink class="router_button" to="/field_notes">[ FIELD NOTES ]</RouterLink>
        <RouterLink class="router_button" to="/experiments">[ EXPERIMENTS ]</RouterLink>
        <RouterLink class="router_button" to="/about">[ ABOUT ME ]</RouterLink>
      </section>
    </div>
    <div class="window additional_info" :class="expanded ? 'jump' : 'hide'">
      <header>WARNING!</header>
      <section>
        I like to play with different visual (and unfortunately resource intensive) stuff, so if the
        website isn't performing great for you, check the simpler version which will certainly be
        easier to navigate, although you might miss the cool visuals.
      </section>
    </div>
    <!-- <section class="recent-content">
      <h2>RECENTLY ADDED</h2>
      <div class="content-grid">

      </div>
    </section>
    <section class="highlights">
      <h2>HIGHLIGHTS</h2>
      <div class="highlights-grid">
        <article
          v-for="item in highlights"
          :key="item.slug"
          class="highlight-card"
        >
          <RouterLink :to="{ name: item.type, params: { slug: item.slug }}">
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
    <!-- <div class="window-controls">
      <button @click="openSimpleWindow">Open Simple Window</button>
      <button @click="openProjectWindow">Open Project Window</button>
    </div> -->
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

const currentTime = ref(new Date())
let timerInterval

const updateTime = () => {
  currentTime.value = new Date()
}

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  updateBgLetters()
  window.addEventListener('resize', updateResolution)
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  updateFPS()
})

onUnmounted(() => {
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

function resetMove() {
  for (let i = 0; i < primary_title.value.innerHTML.length; i++) {
    let letter = secondary_title.value.children[i]
    letter.style.transform = 'unset'
  }
  secondary_title.value.style.gap = '0px'
  clearInterval(randomMoveId)
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
@use '../assets/utils.scss' as utils;

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

body {
  background-color: white !important;
}

.welcome {
  z-index: 10;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:hover {
    .primary {
      scale: 1.01;
      letter-spacing: 1px;
    }
  }
}

.primary {
  @include utils.prevent-select;
  font-family: 'Anton';
  font-size: 120px;
  transition:
    scale var(--ease-out) 100ms,
    letter-spacing var(--ease-out) 100ms;
}

.secondary {
  @include utils.prevent-select;
  cursor: pointer;
  display: flex;
  position: absolute;
  transition: gap 100ms var(--ease-out);

  > * {
    @include utils.prevent-select;
    font-family: 'Permanent Marker';
    font-size: 96px;
    color: #de005d;
    mix-blend-mode: exclusion;
    pointer-events: none;
  }
}

.recent-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.content-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.content-type {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 999px;
  font-size: 0.875rem;
}

.highlights {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.highlight-card {
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #de005d; // Your brand color
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }

  .description {
    margin: 1rem 0;
    color: #666;
    line-height: 1.6;
  }

  .content-type {
    font-size: 0.75rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 999px;
  font-size: 0.875rem;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }
}

.ascii {
  position: absolute;
  z-index: 0;
  color: var(--gray-300);
  // color: #ff0044;
  color: blueviolet;
  clip-path: circle(100px);
  transition: clip-path 200ms cubic-bezier(0.33, 1, 0.68, 1);
  font-weight: 800;
  transform: scale(1.2);
  > * {
    transform: translateY(32px);
  }
}

.expanded {
  clip-path: circle(500px);
  transition: clip-path 1200ms cubic-bezier(0.33, 1, 0.68, 1);
  animation: expand 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.circle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: solid var(--gray-500) 2px;
  width: 640px;
  height: 640px;
  border-radius: 100%;
  z-index: -1;
}

@keyframes expand {
  50% {
    scale: 1.1;
  }
}

@keyframes expand_less {
  from {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    scale: 0.5;
  }
}

@keyframes expand_less_reverse {
  to {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    scale: 0.5;
  }
}

.system_info {
  position: absolute;
  left: calc(50% + calc(64px * 5));
  top: calc(50% - calc(64px * 0.5));
  z-index: 100;
  opacity: 0;
  transition:
    opacity var(--ease-out) 400ms,
    left var(--ease-out) 400ms,
    top var(--ease-out) 400ms,
    transform var(--ease-out) 400ms;
}
.system_info.hide {
  animation: expand_less_reverse 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.system_info.jump {
  opacity: 1;
}

@mixin window {
  max-width: 64px * 4;
  background-color: rgb(from var(--gray-400) r g b / 0.2);
  position: absolute;
  left: calc(50% - calc(64px * 8));
  top: calc(50% - calc(64px * 4));
  border-radius: 8px;
  overflow: hidden;
  outline: rgb(from blueviolet r g b / 0.5) 1px solid;
  z-index: 100;
  box-shadow:
    0px 57px 16px 0px rgb(from var(--gray-500) r g b / 0.01),
    0px 37px 15px 0px rgb(from var(--gray-500) r g b / 0.04),
    0px 21px 12px 0px rgb(from var(--gray-500) r g b / 0.15),
    0px 9px 9px 0px rgb(from var(--gray-500) r g b / 0.26),
    0px 2px 5px 0px rgb(from var(--gray-500) r g b / 0.29);
  backdrop-filter: blur(12px);
  header {
    border-bottom: 1px solid var(--gray-400);
    padding: 8px;
  }
  section {
    padding: 8px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
.window {
  @include window;
  opacity: 0;
  transition:
    opacity var(--ease-out) 400ms,
    left var(--ease-out) 400ms,
    top var(--ease-out) 400ms,
    transform var(--ease-out) 400ms;
}

.window.hide {
  animation: expand_less_reverse 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.window.projects {
  left: calc(50% + calc(64px * 5));
  top: calc(50% + calc(64px * 0));
}

.window.additional_info {
  max-width: 64px * 8;
  top: calc(50% + calc(64px * 2));
}

.router_button {
  all: unset;
  cursor: pointer;
  padding: 6px 12px;
  background-color: var(--gray-400);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jump {
  animation: expand_less 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 1;
}
</style>
