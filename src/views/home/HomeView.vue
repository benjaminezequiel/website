<script>
import AsciiComponent from '../../components/AsciiComponent.vue'
</script>
<template>
  <div class="page--container">
    <div class="page">
      <Header></Header>
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
      <div class="message" v-if="showMessage">
        <header>
          <span class="material-symbols-outlined">INFO</span>
          <span>HEY THERE!</span>
          <span class="material-symbols-outlined close" @click="showMessage = false">close</span>
        </header>
        <section>
          I'm really glad you made it here. Feel free to explore my projects, read some thoughts, or
          just say hi. I hope you find something that inspires you!
        </section>
      </div>
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
      </div> -->
      <!-- <div class="shortcuts">
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
import { onMounted, ref } from 'vue'
import { getContent } from '@/utils/content'
import Header from '@/components/Header.vue'
import Nav from '@/components/Nav.vue'

const primary_title = ref(null)
const secondary_title = ref(null)
let randomMoveId

const navIsOpen = ref(true)

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

const showMessage = ref(true)

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

<style lang="scss">
body {
  --home: unset;
}
</style>
<style scoped lang="scss">
@use './home.scss';
.page--container {
  background-position: center;
  background-image: url('/public/assets/plus_sign.svg');
  background-size: 32px;

  height: 100dvh;
  background-color: var(--gray-1100);
  color: var(--gray-1200);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: auto;

  // background-image: url('/src/assets/plus_sign.svg');
  // background-size: 64px;
  // background-position: center;
}

.page.compact {
  width: 30%;
  height: 60%;
}
</style>
