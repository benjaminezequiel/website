<template>
  <h3>PROJECTS VIEW</h3>
  <div class="projects_grid">
    <router-link
      v-for="project in projects"
      :key="project.slug"
      :to="{ name: 'project', params: { slug: project.slug } }"
      class="project_card"
    >
      <img :src="project.thumbnail" :alt="project.title" />
      <div class="content">
        <h2>{{ project.title }}</h2>
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
@use '../styles/utils.scss' as utils;

.projects_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  width: 1200px;
}

.project_card {
  padding: 0px;
  display: flex;
  flex-direction: column;
  background-color: var(--gray-600);
  border-radius: 8px;
  outline: var(--gray-400) 1px solid;
  text-decoration: none;
  color: inherit;
  position: relative;

  height: 400px;
  transition: scale var(--ease-out) 150ms;
  &:hover {
    scale: 1.01;
  }
  .content {
    position: absolute;
    bottom: 8px;
    left: 12px;
    display: flex;
    flex-direction: column;
    height: fit-content;
  }

  img {
    width: 100%;
    border-radius: 8px 8px 0px 0px;
  }
  h2,
  p,
  img {
    padding: 0;
    margin: 0;
  }
}
</style>
