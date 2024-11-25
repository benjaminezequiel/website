<!-- views/ProjectView.vue -->
<template>
  <article v-if="project">
    <h1>{{ project.title }}</h1>
    <div class="project-meta">
      <span>{{ project.date }}</span>
      <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
    </div>
    <div v-html="project.content"></div>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContent, getContentBySlug } from '@/utils/content'

const route = useRoute()
const project = ref(null)

onMounted(async () => {
  project.value = await getContentBySlug('projects', route.params.slug)
})
</script>