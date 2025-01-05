<template>
  <!-- <Header variant="default" :type="true"></Header> -->
  <div class="page-container single_project">
    <article v-if="project" class="page">
      <div class="breadcrumb">
        <RouterLink class="breadcrumb_previous" to="/projects">PROJECTS</RouterLink>
        <span class="breadcrumb__divider">></span>

        <span>{{ project.title }}</span>
      </div>
      <div class="project--header">
        <div class="project__title-container">
          <h1 class="primary-title">
            {{ project.title }}
            <!-- <span class="secondary-title">{{ project.title }}</span> -->
          </h1>
          <h2 class="project--subtitle">{{ project.subtitle }}</h2>
        </div>
        <!-- <div class="project-meta">
          <span class="project-date"
          >{{ project.author }} --- {{ project.date }} --- {{ project.org }}</span
          >
        </div> -->
        <p class="project-description">{{ project.description }}</p>
        <div class="header-divider">------</div>
      </div>
      <ProjectOutline />
      <div class="project--content" v-html="project.content"></div>
    </article>
    <div v-if="project" class="thumbnail-container">
      <div class="gradient-thumbnail"></div>
      <img :src="project.thumbnail" :alt="project.title" class="thumbnail" />
    </div>
    <div class="scrolling-gradient-top"></div>
    <div class="scrolling-gradient-bottom"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContentBySlug } from '@/utils/content'
import Nav from '@/components/Nav/Nav.vue'
import Header from '@/components/Header/Header.vue'
import ProjectOutline from '@/components/ProjectOutline/ProjectOutline.vue'
import { RouterLink } from 'vue-router'

const route = useRoute()
const project = ref(null)

onMounted(async () => {
  project.value = await getContentBySlug('projects', route.params.slug)
})
</script>

<style lang="scss">
body {
  --page-alignment-y: flex-start;
}
</style>

<style lang="scss" scoped>
@use './styles.scss';
</style>

<style lang="scss">
@use '../../../styles/utils.scss';

.page-container.single_project {
  span.highlight {
    color: var(--blue-600);
  }

  .thumbnail-container {
    @include utils.prevent-select;

    max-width: min(120%, 70rem);
    position: absolute;
    top: 0;

    .thumbnail {
      max-width: 100%;
      object-fit: cover;
      min-height: 480px;
      clip-path: inset(2px);
    }

    &::after {
      content: '';
      position: absolute;

      inset: 0;
      width: 100%;
      height: 100%;
      // background: linear-gradient(transparent, var(--gray-100) 75%);
      background-color: var(--gray-50);
      // -webkit-mask-image: linear-gradient(to top, black 35%, transparent 80%);
      // mask-image: linear-gradient(to top, black 35%, transparent 80%);
      -webkit-mask-image: radial-gradient(ellipse at top center, transparent 10%, black 70%);
      mask-image: radial-gradient(ellipse at top center, transparent 10%, black 70%);
    }
  }

  img {
    all: unset;
  }

  h1.primary-title {
    font-size: 64px;
    line-height: 95%;
    font-feature-settings: 'ss04';
    font-weight: 400;
    text-wrap: balance;
    margin: 0;
    margin-left: -3px;
  }

  img:not(.thumbnail):not(.raw) {
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 12px;
    outline: var(--gray-200) 1px solid;
    width: 100%;
    padding: 32px;
    margin-top: 12px;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .project--content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .project-date {
    font-family: 'Space Mono';
    color: var(--gray-900);
    font-weight: 200;
    letter-spacing: 2px;
    font-size: 18px;
    text-transform: uppercase;
  }

  blockquote {
    margin: 0;
    padding-left: 12px;
    // text-wrap: balance;
    color: var(--gray-500);
    border-left: 2px solid var(--gray-200);

    // p::before {
    //   content: '>';
    //   margin-right: 8px;
    //   color: var(--gray-500);
    // }
  }
  span.secondary-illustration {
    width: 100%;
    img {
      width: 100%;
      margin: 0;
      outline: unset !important;
    }
  }

  .project--content {
    .image-label {
      font-family: 'Inter';
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      margin-top: -20px;
      color: var(--gray-600);
      gap: 4px;
    }

    hr {
      all: unset;
      width: 100%;
      border-bottom: 1px solid var(--gray-200);
      margin-top: 32px;
      margin-bottom: 16px;
    }
    a.header-anchor {
      color: var(--gray-400);
    }
    h1 {
      scroll-margin: 800px;
    }
    h1,
    h2,
    h3,
    h4,
    h5 {
      margin: 0;
      font-feature-settings: 'ss04';
      scroll-margin: 240px;
    }

    h2 {
      margin-top: 12px;
      text-transform: uppercase;
      font-weight: 450;
      letter-spacing: 1px;
    }
    h3 {
      margin-top: 20px;
      text-transform: uppercase;
      font-weight: 450;
      letter-spacing: 1px;
      color: var(--gray-900);
    }
    h4 {
      margin-top: 16px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--gray-1000);
    }

    a {
      font-family: 'Inter';
      color: yellow;
      text-decoration: none;
    }
    p {
      margin: 0;
      line-height: 150%;
    }
  }
}
</style>
