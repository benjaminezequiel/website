<template>
  <div class="project_card">
    <div class="top-gradient"></div>
    <div v-if="project.external" class="project__external">BEHANCE</div>
    <div class="project__date">{{ project.date }}</div>
    <img :src="project.thumbnail" :alt="project.title" />
    <div class="content">
      <h2>{{ project.title }}</h2>
      <h4>{{ project.subtitle }}</h4>
      <!-- <p>{{ project.description }}</p> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
  },
})
</script>

<style lang="scss" scoped>
.project_card {
  cursor: pointer;
  width: 100%;
  padding: 0px;
  display: flex;
  flex-direction: column;
  background-color: var(--gray-100);
  border-radius: 15px;
  border: var(--gray-200) 1px solid;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;

  box-shadow: color-mix(in oklch, var(--gray-25) 50%, transparent) 0px 12px 32px -2px;
  height: 400px;
  transition:
    transform var(--ease-out) 150ms,
    rotate var(--ease-out) 150ms,
    box-shadow var(--ease-out) 800ms;

  &:hover {
    img {
      opacity: 1;
    }
    .top-gradient {
      opacity: 1;
    }
    rotate: 0.5deg;
    transform: translateY(-2px);
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

    background: linear-gradient(in oklch, transparent 40%, var(--gray-100) 100%);

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
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    object-fit: cover;
    width: 100%;
    position: absolute;
    inset: 0;
    -webkit-mask-image: linear-gradient(to top, transparent 0%, black 50%);
    mask-image: linear-gradient(to top, transparent 0%, bla3k 50%);
    scale: 1.05;
    height: 100%;
    transition: var(--ease-out) 400ms opacity;
  }

  h2,
  p,
  img {
    padding: 0;
    margin: 0;
  }
}

.project__date {
  position: absolute;
  color: var(--gray-500);
  top: 16px;
  font-size: 20px;
  right: 16px;
  z-index: 100;
  mix-blend-mode: difference;
}

.project__external {
  position: absolute;
  color: var(--gray-400);
  top: 16px;
  font-feature-settings: 'ss04' on;
  font-size: 20px;
  left: 16px;
  z-index: 100;
  mix-blend-mode: difference;
}
.top-gradient {
  width: 50%;
  height: 50%;
  background-color: var(--gray-500);
  mix-blend-mode: lighten;
  position: absolute;
  z-index: 100;
  left: 50%;
  transform: translate(-50%, -80%);
  border-radius: 100%;
  filter: blur(120px);
  opacity: 0;
  transition: opacity var(--ease-out) 800ms;
}
</style>
