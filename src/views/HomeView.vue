<script>
import AsciiComponent from './AsciiComponent.vue'
import asciiBg from '@/components/asciiBg.vue'
</script>
<template>
  <!-- <div class="circle"></div> -->
  <div class="page">
    <AsciiComponent ref="asciiB" class="ascii" :class="expanded ? 'expanded' : ''"></AsciiComponent>

    <!-- <asciiBg style="width: 1920px; height: 1080px"></asciiBg> -->
    <div class="welcome">
      <!-- <RouterLink to="/ascii">ASCII VIEW</RouterLink> -->
      <div class="primary" ref="primary_title">WELCOME</div>
      <div
        class="secondary"
        ref="secondary_title"
        @mouseover="startMove"
        @mouseleave="resetMove"
        @click="handleWelcomeClick"
      ></div>
    </div>
    <!-- <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam imperdiet tristique tortor,
      vel condimentum nisl porta eu. Pellentesque dignissim elementum tortor, ut sodales augue
      tempor ut. Aenean vel aliquam sem. Aliquam ullamcorper mauris et nisl tincidunt venenatis. Nam
      eu pellentesque tellus. Donec pharetra suscipit porta. Donec nisl elit, bibendum quis erat
      vel, hendrerit efficitur nisl. Nunc vitae sem dui.
    </div>
    <img src="../assets/logo/full_logo.svg" alt="" /> -->
    <!-- <section class="recent-content">
      <h2>RECENTLY ADDED</h2>
      <div class="content-grid">
        <article v-for="item in recentItems" :key="item.slug" class="content-card">
          <RouterLink :to="{ name: item.type, params: { slug: item.slug }}">
            <span class="content-type">{{ item.type }}</span>
            <h3>{{ item.title }}</h3>
            <time>{{ formatDate(item.date) }}</time>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </RouterLink>
        </article>
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getContent } from '@/utils/content'

const primary_title = ref(null)
const secondary_title = ref(null)
let randomMoveId

onMounted(() => {
  updateBgLetters()
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const [projects, posts, experiments] = await Promise.all([
    getContent('projects'),
    getContent('field-notes'),
    getContent('experiments'),
  ])

  // Combine and add type property
  const allItems = [
    ...projects.map((p) => ({ ...p, type: 'project' })),
    ...posts.map((p) => ({ ...p, type: 'note' })),
    ...experiments.map((e) => ({ ...e, type: 'experiment' })),
  ]

  // Sort by date and take latest 6
  recentItems.value = allItems.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
})

const highlights = ref([])

const formatContentType = (type) => {
  switch (type) {
    case 'note':
      return 'FIELD NOTE'
    case 'project':
      return 'PROJECT'
    case 'experiment':
      return 'EXPERIMENT'
    default:
      return type.toUpperCase()
  }
}

onMounted(async () => {
  // Fetch all content types
  const [projects, notes, experiments] = await Promise.all([
    getContent('projects'),
    getContent('field-notes'),
    getContent('experiments'),
  ])

  // Process highlighted items
  const allHighlights = [
    ...projects.map((p) => ({ ...p, type: 'project' })),
    ...notes.map((n) => ({ ...n, type: 'note' })),
    ...experiments.map((e) => ({ ...e, type: 'experiment' })),
  ]
    .filter((item) => item.highlight)
    .sort((a, b) => (a.highlightOrder || 99) - (b.highlightOrder || 99))

  highlights.value = allHighlights

  // Process recent items (excluding highlights if you want)
  const allItems = [
    ...projects.map((p) => ({ ...p, type: 'project' })),
    ...notes.map((n) => ({ ...n, type: 'note' })),
    ...experiments.map((e) => ({ ...e, type: 'experiment' })),
  ].filter((item) => !item.highlight) // Optional: exclude highlighted items from recent

  recentItems.value = allItems.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
})

const expanded = ref(false)
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
}

.primary {
  @include utils.prevent-select;
  pointer-events: none;
  font-family: 'Anton';
  font-size: 120px;
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
  scale: 1.5;
  z-index: 0;
  color: var(--gray-300);
  clip-path: circle(100px);
  transition: clip-path 400ms cubic-bezier(0.33, 1, 0.68, 1);
  font-weight: 800;
  > * {
    transform: translateX(20px) translateY(32px);
  }
}

.expanded {
  clip-path: circle(500px);
  transition: clip-path 1200ms cubic-bezier(0.33, 1, 0.68, 1);
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
</style>
