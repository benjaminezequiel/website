<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { inject } from '@vercel/analytics'
// import WindowManager from '@/components/WindowManager.vue'
// import DrawingOverlay from '@/components/DrawingOveraly.vue'
//import Nav from './components/Nav.vue'

inject()
</script>

<!-- <DrawingOverlay /> -->
<!-- <WindowManager /> -->
<template>
  <SpeedInsights />
  <RouterView />
</template>

<style lang="scss">
@use './styles/index.scss';
</style>
