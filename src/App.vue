<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { inject } from '@vercel/analytics'
// import WindowManager from '@/components/WindowManager.vue'
// import DrawingOverlay from '@/components/DrawingOveraly.vue'
//import Nav from './components/Nav.vue'
import { useRoute } from 'vue-router'
import Nav from './components/Nav.vue'
inject()

const route = useRoute()
const currentRoute = computed(() => {
  // Extract the active route name without the leading slash
  return route.path.slice(1) || 'home'
})
</script>

<!-- <DrawingOverlay /> -->
<!-- <WindowManager /> -->
<template>
  <SpeedInsights />
  <Transition mode="out-in">
    <component :is="Component" />
  </Transition>
  <RouterView />
  <Nav :active="currentRoute"></Nav>
</template>

<style lang="scss">
@use './styles/index.scss';
</style>
