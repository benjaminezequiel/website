<template>
  <h3>PROJECTS VIEW</h3>
  <div class="projects-grid">
    <router-link
      v-for="project in projects"
      :key="project.slug"
      :to="{ name: 'project', params: { slug: project.slug } }"
      class="project-card"
    >
      <img :src="project.thumbnail" :alt="project.title" />
      <h2>{{ project.title }}</h2>
      <div class="tags">
        <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/utils/content'

const projects = ref([])

onMounted(async () => {
  console.log('Fetching projects...')
  projects.value = await getContent('projects')
  console.log('Projects:', projects.value)
})
</script>

<style lang="scss">
img {
  max-width: 800px;
}
</style>
