<!-- views/ProjectView.vue -->
<template>
  <Header class="header"></Header>
  <div class="page--container">
    <article v-if="project" class="page">
      <h1>{{ project.title }}</h1>
      <div class="project-meta">
        <span class="project-date"
          >{{ project.author }} | {{ project.date }} | {{ project.org }}</span
        >
        <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
      </div>
      <div class="project--content" v-html="project.content"></div>
    </article>
    <div v-if="project" class="thumbnail-container">
      <img :src="project.thumbnail" :alt="project.title" class="thumbnail" />
    </div>
    <div class="scrolling-gradient-top"></div>
    <div class="scrolling-gradient"></div>
  </div>
  <Nav :show-message="false" active="none"></Nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContent, getContentBySlug } from '@/utils/content'
import Nav from '@/components/Nav.vue'
import Header from '@/components/Header.vue'

const route = useRoute()
const project = ref(null)

onMounted(async () => {
  project.value = await getContentBySlug('projects', route.params.slug)
})
</script>

<style lang="scss">
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
  max-width: min(92%, 50rem);
  display: flex;
  z-index: 10;
  flex-direction: column;
  width: 100%;
  gap: 24px;
  padding-bottom: min(20%, 12rem);
  padding-top: min(25%, 24rem);

  p {
    font-family: 'Inter';
    line-height: 140%;
    margin: 0;
  }
}

.thumbnail-container {
  max-width: min(120%, 70rem);
  position: absolute;
  top: 0;

  .thumbnail {
    max-width: 100%;
    clip-path: inset(2px);
  }

  &::after {
    content: '';
    position: absolute;

    inset: 0;
    width: 100%;
    height: 100%;
    // background: linear-gradient(transparent, var(--gray-100) 75%);
    background-color: var(--gray-100);
    -webkit-mask-image: linear-gradient(to top, black 35%, transparent 80%);
    mask-image: linear-gradient(to top, black 35%, transparent 80%);
    filter: blur(16px);
  }
}

img {
  all: unset;
}

h1 {
  font-size: 48px;
  line-height: 95%;
  font-feature-settings: 'ss04';
  font-weight: 400;
  text-wrap: balance;
  margin: 0;
}

img:not(.thumbnail) {
  max-width: 100%;
  border-radius: 12px;
  outline: var(--gray-400) 1px solid;
  margin-top: 16px;
  margin-bottom: 16px;
  overflow: hidden;
}

.project--content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

h2 {
  margin-top: 12px;
}
h3 {
  margin-top: 20px;
}
h4 {
  margin-top: 28px;
}

.scrolling-gradient {
  width: 100%;
  height: 100%;
  position: fixed;
  // background: linear-gradient(to top, var(--gray-100) 0%, transparent 15%);
  background: url('/assets/dotted-bg.svg');
  -webkit-mask-image: linear-gradient(to top, black 0%, transparent 3%);
  mask-image: linear-gradient(to top, black 0%, transparent 3%);
  background-size: 32px;
  bottom: 0;
  z-index: 10;
  pointer-events: none;
}

.scrolling-gradient-top {
  width: 100%;
  height: 100%;
  position: fixed;
  // background: linear-gradient(to top, var(--gray-100) 0%, transparent 15%);
  background: url('/assets/dotted-bg.svg');
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 5%);
  mask-image: linear-gradient(to bottom, black 0%, transparent 5%);
  background-size: 32px;
  bottom: 0;
  z-index: 10;
  pointer-events: none;
}

a {
  color: yellow;
  text-decoration: none;
}

.project-date {
  font-family: 'Space Mono';
  color: var(--gray-900);
  font-size: 18px;
  text-transform: uppercase;
}
.header {
  img {
    outline: none;
    margin: 0;
    border-radius: 0;
  }
}
</style>

<style lang="scss" scoped>
.header {
  position: fixed;
  max-width: min(93%, 51rem);
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(8px);
  padding: 16px 20px 12px 16px;
  border-radius: 8px;
  height: fit-content;
  display: flex;
  align-items: center;
  box-shadow: 0px 4px 12px -2px rgba(0, 0, 0, 0.5);

  outline: var(--gray-400) 1px solid;
  z-index: 1000;
}
</style>
