<template>
  <div class="home__page">
    <vAscii class="floating-ascii" :class="expanded ? 'expanded' : ''" />
    <div class="home__background" :class="expanded ? 'expanded' : ''">
      <div class="circle_5"></div>
      <div class="circle_4"></div>
      <div class="circle_3"></div>
      <div class="circle_2"></div>
      <div class="circle_1"></div>
    </div>
    <WelcomeTitle @click="handleWelcomeClick" class="welcome-title" />
    <!-- <Header></Header> -->
  </div>
  <Nav active="home" :show-message="true"></Nav>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header/Header.vue'
import Nav from '@/components/Nav.vue'
import WelcomeTitle from '@/components/WelcomeTitle/WelcomeTitle.vue'
import vAscii from '../../components/vAscii.vue'

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
@use './styles.scss';
</style>

<!-- <script>
// const recentItems = ref([])

// onMounted(async () => {
//   const [projects, posts, experiments] = await Promise.all([
//     getContent('projects'),
//     getContent('field-notes'),
//     getContent('experiments'),
//   ])

//   const allItems = [
//     ...projects.map((p) => ({ ...p, type: 'project' })),
//     ...posts.map((p) => ({ ...p, type: 'note' })),
//     ...experiments.map((e) => ({ ...e, type: 'experiment' })),
//   ]

//   recentItems.value = allItems.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
// })

// const highlights = ref([])

// onMounted(async () => {
//   const [projects, notes, experiments] = await Promise.all([
//     getContent('projects'),
//     getContent('field-notes'),
//     getContent('experiments'),
//   ])

//   const allHighlights = [
//     ...projects.map((p) => ({ ...p, type: 'project' })),
//     ...notes.map((n) => ({ ...n, type: 'note' })),
//     ...experiments.map((e) => ({ ...e, type: 'experiment' })),
//   ]
//     .filter((item) => item.highlight)
//     .sort((a, b) => (a.highlightOrder || 99) - (b.highlightOrder || 99))

//   highlights.value = allHighlights

//   const allItems = [
//     ...projects.map((p) => ({ ...p, type: 'project' })),
//     ...notes.map((n) => ({ ...n, type: 'note' })),
//     ...experiments.map((e) => ({ ...e, type: 'experiment' })),
//   ].filter((item) => !item.highlight)
//   recentItems.value = allItems.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
// })
</script> -->
