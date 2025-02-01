<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { inject } from '@vercel/analytics'
import { useRoute } from 'vue-router'
import Nav from './components/Nav/Nav.vue'

inject()

const route = useRoute()
const currentRoute = computed(() => {
  return route.path.slice(1) || 'home'
})

const transitionKey = ref(0)
const isTransitioning = ref(false)

watch(
  () => route.path,
  (newVal, oldVal) => {
    if (isTransitioning.value) {
      transitionKey.value++ // Force component recreation
      return
    }

    isTransitioning.value = true
    setTimeout(() => {
      isTransitioning.value = false
    }, 600) // Match transition duration
  },
)
</script>

<template>
  <!-- <RouterView v-slot="{ Component }" class="router-view">
    <component :is="Component" :key="transitionKey" v-if="!isTransitioning" />
  </RouterView> -->
  <RouterView />
  <Nav :active="currentRoute" />
  <SpeedInsights />
</template>

<style lang="scss">
@use './styles/index.scss';

.router-view {
  background-color: black;
}
.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: opacity 100ms ease;
  // position: absolute;
  // top: 0;
  // left: 0;
}

.page-opacity-enter-from {
  // transform: translate(100%, 0);
  // scale: 0.8;
  opacity: 0;
}

.page-opacity-leave-to {
  // transform: translate(-100%, 0);
  // scale: 0.8;
  opacity: 0;
}
.page-opacity-enter-to,
.page-opacity-leave-from {
  // transform: translate(0, 0);
  // scale: 1;
}
</style>
