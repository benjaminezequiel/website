<template>
  <div class="page--container">
    <div class="page">
      <header class="page-subheader">
        <h1 class="page--title">
          <span class="material-symbols-outlined title-icon">thread_unread</span>
          <span>EXPERIMENTS</span>
        </h1>
        <!-- <p>
          These are some of my favorite projects - ones where I really got to dig deep into design
          problems I care about. Each represents different challenges I've tackled, from making
          design theory more approachable to crafting brands that tell meaningful stories. Take a
          look at my process and the thinking behind each solution.
        </p> -->
      </header>

      <div class="experiments-grid">
        <article
          v-for="(experiment, index) in experiments"
          :key="experiment.slug"
          class="experiment-card animate"
          :animation-index="index"
        >
          <a
            :to="{ name: 'experiment', params: { slug: experiment.slug } }"
            class="experiment-content"
            :href="experiment.link"
          >
            <span class="experiment__left-container">
              <p
                v-if="experiment.WIP"
                class="experiment__WIP"
                v-tooltip="{
                  theme: 'default-tooltip',
                  content: experiment.title + ' is still under development!',
                }"
              >
                [WIP]
              </p>
              <h2>{{ experiment.title }}</h2>
            </span>
            <p v-if="experiment.description">{{ experiment.description }}</p>
            <span class="experiment-date">{{ experiment.date }}</span>
            <span :href="experiment.link" class="experiment-link"
              >{{ experiment.link_name }} 🡥</span
            >
            <!-- <time>{{ formatDate(experiment.date) }}</time> -->
          </a>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/utils/content'
import Nav from '@/components/Nav/Nav.vue'

const experiments = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  experiments.value = await getContent('experiments')
})
</script>

<style scoped lang="scss">
@use '../../styles/utils.scss' as utils;
/* .experiments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.experiment-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: transform 0.2s;
}

.experiment-card:hover {
  transform: translateY(-4px);
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 999px;
  font-size: 0.875rem;
} */

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
.experiments-grid {
  all: unset;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(auto, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  width: 100%;
}

.experiment-card {
  &:has(a:focus-visible) {
    outline: 2px solid var(--blue-400) !important;
    outline-offset: 2px !important;
  }

  cursor: pointer;
  display: flex;
  flex-direction: column;
  background-color: var(--gray-100);
  border-radius: 12px;
  border: var(--gray-200) 1px solid;
  text-decoration: none;
  color: inherit;
  position: relative;

  overflow: hidden;

  transition:
    scale var(--ease-out) 150ms,
    box-shadow var(--ease-out) 800ms;

  .experiment-content {
    all: unset;

    height: 100%;
    display: flex;
    padding: 16px;
    gap: 12px;
    align-items: center;
  }

  &:hover {
    scale: 1.005;
    box-shadow: var(--gray-75) 0px 8px 64px -4px;
  }

  h2 {
    font-size: var(--fluid-fontSize-s);
    text-wrap: nowrap;
    font-feature-settings: 'ss04';
    text-transform: uppercase;
    text-overflow: ellipsis;
    font-weight: 500;
    letter-spacing: 1px;
    z-index: 2;
    line-height: 100%;
  }

  // .content {
  //   width: 100%;
  //   min-height: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   z-index: 1;
  //   position: relative;
  //   height: fit-content;
  //   align-items: flex-start;
  //   justify-content: flex-end;
  //   background: linear-gradient(in oklch, transparent, var(--gray-75) 80%);

  //   // &::before {
  //   //   content: '';
  //   //   width: 100%;
  //   //   height: 100%;
  //   //   top: 0;
  //   //   left: 0;
  //   //   position: absolute;
  //   //   background-image: radial-gradient(transparent 1px, var(--gray-100) 1px);
  //   //   background-size: 4px 4px;

  //   //   /* Blur effect with fallback */
  //   //   backdrop-filter: blur(80px);
  //   //   -webkit-backdrop-filter: blur(80px); /* Safari support */

  //   //   /* Mask gradient - using both standard and webkit prefix */
  //   //   -webkit-mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
  //   //   mask-image: linear-gradient(to bottom, transparent 10%, black 100%);
  //   // }

  //   padding: 16px 20px;
  // }
  gap: 4px;

  p {
    color: var(--gray-500);
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
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
  background-color: var(--gray-25);
  width: 100%;
  height: fit-content;
  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-1200);
  &::before {
    animation-duration: 2s;
    animation-name: simple-fade-in;
    animation-fill-mode: forwards;
    animation-timing-function: var(--ease-out);

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
  background-color: var(--gray-75);
  background-image: radial-gradient(transparent 1px, var(--gray-50, #ffffff) 1px);
  background-size: 12px 12px;
}

.animate {
  animation-duration: 500ms;
  animation-name: animate-fade;
  animation-delay: var(--_animation-delay);
  animation-fill-mode: backwards;
  animation-timing-function: var(--ease-out);
}

@mixin animation-delays($count: 6, $base-delay: 000ms, $increment: 100ms) {
  @for $i from 0 through $count - 1 {
    [animation-index='#{$i}'] {
      --_animation-delay: #{$base-delay + ($i * $increment)};
      --_card-rotation: #{if($i % 2 == 0, -1deg, 1deg)};
    }
  }
}

@include animation-delays();
@keyframes simple-fade-in {
  from {
    opacity: 0;
  }
}

@keyframes animate-fade {
  0% {
    opacity: 0;
    transform: translateY(16px);
    scale: 0.5;
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
    scale: 1;
  }
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
    font-family: 'Inter';
    letter-spacing: 0.5px;
  }
}

.experiment-link {
  text-wrap: nowrap;
  color: var(--sea-green);
}

.experiment__left-container {
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 8px;

  .experiment__WIP {
    color: var(--yellow-600);
    letter-spacing: 2px;
  }
}
.experiment-date {
  text-wrap: nowrap;
  color: var(--gray-500);
}
</style>
