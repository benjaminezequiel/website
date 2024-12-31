<template>
  <!-- <Header variant="default" :type="true"></Header> -->
  <div class="page--container project_page">
    <article v-if="project" class="page">
      <div class="project--header">
        <h1>{{ project.title }}</h1>
        <div class="project-meta">
          <span class="project-date"
            >{{ project.author }} | {{ project.date }} | {{ project.org }}</span
          >
        </div>
        <p class="project-description">{{ project.description }}</p>
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
  <Nav :show-message="false" active="none" :hidable="true"></Nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContentBySlug } from '@/utils/content'
import Nav from '@/components/Nav.vue'
import Header from '@/components/Header/Header.vue'
import ProjectOutline from '@/components/ProjectOutline.vue'

const route = useRoute()
const project = ref(null)

onMounted(async () => {
  project.value = await getContentBySlug('projects', route.params.slug)
})
</script>

<style lang="scss">
@use '../styles/utils';

body {
  --page-alignment-y: flex-start;
}

.page--container {
  background-color: var(--gray-50);
  height: fit-content;
  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-900);
  width: 100%;
}

.page {
  position: relative;
  max-width: min(92%, 50rem);
  display: flex;
  z-index: 10;
  flex-direction: column;
  width: 100%;
  gap: 24px;
  padding-top: clamp(18rem, 64%, 24rem);
  padding-bottom: min(20%, 18rem);

  p {
    font-family: 'Inter';
    line-height: 140%;
    margin: 0;
    // letter-spacing: 0.25px;
    strong {
      font-family: 'Inter';
    }
  }
}

.project_page {
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
    outline: var(--gray-200) 1px solid;
    margin-top: 16px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .project--content {
    display: flex;
    flex-direction: column;
    gap: 12px;
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

  .project-date {
    font-family: 'Space Mono';
    color: var(--gray-900);
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
}

.image-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 12px;
  margin-top: 4px;
  color: var(--gray-600);
  gap: 4px;
}

hr {
  all: unset;
  width: 100%;
  border-bottom: 1px solid var(--gray-300);
  margin-top: 16px;
}
</style>

<style lang="scss" scoped>
.gradient-thumbnail {
  width: 100%;
  height: 80%;

  position: absolute;
  bottom: 0px;
  z-index: 1;
  pointer-events: none;

  // /* Base dotted pattern */
  background-image: radial-gradient(transparent 1px, var(--gray-50, #000) 1px);
  background-size: 4px 4px;

  // /* Blur effect with fallback */
  backdrop-filter: blur(80px);
  -webkit-backdrop-filter: blur(80px); /* Safari support */

  // /* Mask gradient - using both standard and webkit prefix */
  -webkit-mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
  mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
}

.scrolling-gradient-bottom {
  width: 100%;
  height: 48px;
  position: fixed;
  bottom: -2px;
  z-index: 10;
  pointer-events: none;

  /* Base dotted pattern */
  background-image: radial-gradient(transparent 1px, var(--gray-50, #000) 1px);
  background-size: 4px 4px;

  /* Blur effect with fallback */
  backdrop-filter: blur(80px);
  -webkit-backdrop-filter: blur(80px); /* Safari support */

  /* Mask gradient - using both standard and webkit prefix */
  -webkit-mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
  mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
}

.scrolling-gradient-top {
  width: 100%;
  height: 48px;
  position: fixed;
  top: -2px;
  z-index: 10;
  pointer-events: none;

  /* Base dotted pattern */
  background-image: radial-gradient(transparent 1px, var(--gray-50, #ffffff) 1px);
  background-size: 4px 4px;

  /* Blur effect with fallback */
  backdrop-filter: blur(80px);
  -webkit-backdrop-filter: blur(80px); /* Safari support */

  /* Mask gradient - using both standard and webkit prefix */
  -webkit-mask-image: linear-gradient(to top, transparent 10%, black 100%);
  mask-image: linear-gradient(to top, transparent 10%, black 100%);
}

.project-description {
  color: var(--gray-900);
}

.project--header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.divider {
  border-top: var(--gray-400) 1px solid;
  width: 100%;
}

.image-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
</style>
