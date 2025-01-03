<template>
  <div class="home__page">
    <div class="home__background" :class="expanded ? 'expanded' : ''">
      <div class="circle_5"></div>
      <div class="circle_4"></div>
      <div class="circle_3"></div>
      <div class="circle_2"></div>
      <div class="circle_1"></div>
    </div>
    <vAscii
      class="floating-ascii"
      :class="expanded ? 'expanded' : ''"
      modelPath="/assets/object_to_ascii.obj"
      :asciiConfig="{
        width: 200,
        height: 60,
        chars: ' .:+#@',
        renderWidth: 600,
        renderHeight: 300,
      }"
      :cameraConfig="{
        fov: 15,
        position: { x: 0, y: 0, z: 50 },
      }"
      :controlsConfig="{
        autoRotateSpeed: 4,
        enableZoom: false,
      }"
      :show-debug="false"
    />
    <WelcomeTitle @click="handleWelcomeClick" class="welcome-title" />
    <!-- <Header></Header> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

import WelcomeTitle from '@/components/WelcomeTitle/WelcomeTitle.vue'
import vAscii from '../../components/vAscii/vAscii.vue'

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
