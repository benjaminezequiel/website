<template>
  <div class="page--container">
    <div class="page">
      <!-- <Header class="page--header"></Header> -->
      <header class="page-subheader">
        <h1 class="page--title">
          <span class="material-symbols-outlined title-icon">design_services</span>
          <span>PROJECTS</span>
        </h1>
        <p>
          These are some of my favorite projects - ones where I really got to dig deep into design
          problems I care about. Each represents different challenges I've tackled, from making
          design theory more approachable to crafting brands that tell meaningful stories. Take a
          look at my process and the thinking behind each solution.
        </p>
      </header>

      <div class="projects_grid">
        <router-link
          v-for="project in visibleProjects"
          :key="project.slug"
          :to="{ name: 'project', params: { slug: project.slug } }"
          class="project_card"
        >
          <img :src="project.thumbnail" :alt="project.title" />
          <div class="content">
            <h2>{{ project.title }}</h2>
            <h4>{{ project.subtitle }}</h4>
            <!-- <p>{{ project.description }}</p> -->
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getContent } from '@/utils/content'
import Header from '@/components/Header/Header.vue'
import Nav from '@/components/Nav.vue'

const projects = ref([])

const visibleProjects = computed(() => {
  return projects.value.filter((project) => !project.hidden)
})

onMounted(async () => {
  console.log('Fetching projects...')
  projects.value = await getContent('projects')
  console.log('Projects:', projects.value)
})
</script>

<style>
body {
  --page-alignment-y: flex-start;
}
</style>

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
  all: unset;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  // grid-template-columns: repeat(1, 1fr);
  // grid-template-rows: repeat(auto, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  width: 100%;
}

.project_card {
  width: 100%;
  padding: 0px;
  display: flex;
  flex-direction: column;
  background-color: var(--gray-100);
  border-radius: 16px;
  border: var(--gray-200) 1px solid;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;

  // max-width: 50vw;

  box-shadow: color-mix(in oklch, var(--gray-25) 50%, transparent) 0px 12px 32px -2px;
  height: 400px;
  transition:
    transform var(--ease-out) 150ms,
    box-shadow var(--ease-out) 800ms;

  // &:last-child {
  //   grid-column: span 2;
  // }

  &:hover {
    // scale: 1.005;
    transform: translateY(-2px);
    // box-shadow: var(--gray-75) 0px 8px 64px -4px;
  }

  .content {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 1;
    position: relative;
    height: fit-content;
    align-items: flex-start;
    justify-content: flex-end;
    background: linear-gradient(in oklch, transparent, var(--gray-75) 80%);

    // &::before {
    //   content: '';
    //   width: 100%;
    //   height: 100%;
    //   top: 0;
    //   left: 0;
    //   position: absolute;
    //   background-image: radial-gradient(transparent 1px, var(--gray-100) 1px);
    //   background-size: 4px 4px;

    //   /* Blur effect with fallback */
    //   backdrop-filter: blur(80px);
    //   -webkit-backdrop-filter: blur(80px); /* Safari support */

    //   /* Mask gradient - using both standard and webkit prefix */
    //   -webkit-mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
    //   mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
    // }

    padding: 16px 20px;

    gap: 4px;
    h2 {
      font-size: 36px !important;
      font-feature-settings: 'ss04';
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 1px;
      z-index: 2;
      line-height: 100%;
    }

    h4 {
      font-feature-settings: 'ss04';
      margin: 0;
      font-size: 20px;
      text-wrap: balance;
      font-weight: 400;
      color: var(--gray-500);
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
    -webkit-mask-image: linear-gradient(to top, transparent 0%, black 50%);
    mask-image: linear-gradient(to top, transparent 0%, bla3k 50%);
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
  &::before {
    content: '';
    width: 20%;
    height: 80%;
    background-color: var(--gray-300);
    filter: blur(350px);
    position: absolute;
    top: -30%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    opacity: 0.4;
  }
  // background-color: var(--gray-25);
  background-color: var(--gray-100);
  background-image: radial-gradient(transparent 1px, var(--gray-50, #ffffff) 1px);
  background-size: 12px 12px;

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
