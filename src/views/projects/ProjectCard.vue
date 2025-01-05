<template>
  <div class="project_card">
    <img :src="project.thumbnail" :alt="project.title" />
    <div class="content">
      <h2>{{ project.title }}</h2>
      <h4>{{ project.subtitle }}</h4>
      <!-- <p>{{ project.description }}</p> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  border-radius: 16px;
  border: var(--gray-200) 1px solid;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;

  box-shadow: color-mix(in oklch, var(--gray-25) 50%, transparent) 0px 12px 32px -2px;
  height: 400px;
  transition:
    transform var(--ease-out) 150ms,
    box-shadow var(--ease-out) 800ms;

  &:hover {
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
    background: linear-gradient(in oklch, transparent, var(--gray-75) 80%);
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
</style>
