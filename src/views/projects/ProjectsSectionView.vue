<template>
  <div class="page-container">
    <div class="page">
      <header class="header">
        <h1 class="header__title">
          <span class="material-symbols-outlined header__title-icon">design_services</span>
          <span>PROJECTS</span>
        </h1>
        <!-- <p class="header__description">
          These are some of my favorite projects - ones where I really got to dig deep into design
          problems I care about. Each represents different challenges I've tackled, from making
          design theory more approachable to crafting brands that tell meaningful stories. Take a
          look at my process and the thinking behind each solution.
        </p> -->
      </header>
      <div class="projects_grid">
        <router-link
          v-for="project in visibleProjects"
          :key="project.slug"
          :to="{ name: 'project', params: { slug: project.slug } }"
        >
          <ProjectCard :project="project" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getContent } from '@/utils/content'
import ProjectCard from './ProjectCard.vue'

const projects = ref([])

const visibleProjects = computed(() => {
  return projects.value.filter((project) => !project.hidden)
})

onMounted(async () => {
  projects.value = await getContent('projects')
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
