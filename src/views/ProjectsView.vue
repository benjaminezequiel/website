<template>
  <div class="page--container">
    <Nav active="projects"></Nav>
    <div class="page">
      <Header class="page--header"></Header>
      <header class="page-subheader">
        <h1 class="page--title">
          <span class="material-symbols-outlined title-icon">design_services</span>
          <span>PROJECTS</span>
        </h1>
        <p>This are some of my favorite projects!</p>
      </header>
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
            <p>{{ project.description }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/utils/content'
import Header from '@/components/Header.vue'
import Nav from '@/components/Nav.vue'

const projects = ref([])

onMounted(async () => {
  console.log('Fetching projects...')
  projects.value = await getContent('projects')
  console.log('Projects:', projects.value)
})
</script>

<style lang="scss" scoped>
@use '../styles/utils.scss' as utils;

.page--header {
  position: static;
  padding: 0;
}

h1 {
  font-size: 48px;
  margin: 0;
  font-weight: 450;
  letter-spacing: 0.5;
}
.projects_grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(auto, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  width: 100%;
}

.project_card {
  padding: 0px;
  display: flex;
  flex-direction: column;
  background-color: var(--gray-200);
  border-radius: 16px;
  border: var(--gray-300) 2px solid;
  text-decoration: none;
  color: inherit;
  position: relative;

  overflow: hidden;

  height: 400px;
  transition: scale var(--ease-out) 150ms;

  &:hover {
    scale: 1.01;
  }

  .content {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 1;
    height: fit-content;
    align-items: flex-start;
    justify-content: flex-end;
    background: linear-gradient(in oklch, transparent, rgb(from var(--gray-100) r g b / 0.8));
    padding: 16px 20px;

    gap: 4px;
    h2 {
      font-size: 36px !important;
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 1px;
    }
    p {
      color: var(--gray-900);
      text-wrap: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
    }
  }

  img {
    object-fit: cover;
    width: 100%;
    position: absolute;
    inset: 0;
    scale: 1.05;
    height: 100%;
  }

  h2,
  p,
  img {
    padding: 0;
    margin: 0;
  }
}

.page--container {
  background-color: var(--gray-100);
  height: fit-content;
  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-1200);
}

.page {
  max-width: min(92%, 75rem);
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
  padding-bottom: min(15%, 8rem);
  padding-top: min(15%, 8rem);
}

.page--title {
  display: flex;
  align-items: center;
  gap: 12px;

  .title-icon {
    font-size: 48px;
    font-variation-settings: 'wgth' 300;
    color: var(--brand-color-3);
  }
}

.page-subheader {
  display: flex;
  flex-direction: column;
  gap: 4px;
  p {
    margin: 0;
    color: var(--gray-1000);
    font-family: 'Manrope';
    letter-spacing: 0.5px;
  }
}
</style>
