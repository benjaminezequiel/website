<script setup>
import { RouterLink, RouterView } from 'vue-router'
import WindowManager from '@/components/WindowManager.vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import DrawingOverlay from '@/components/DrawingOveraly.vue'
import { inject } from '@vercel/analytics'
//import Nav from './components/Nav.vue'

inject()
</script>

<template>
  <!-- <DrawingOverlay /> -->
  <SpeedInsights />
  <RouterView />
  <WindowManager />
</template>

<style lang="scss">
@use './styles/base.scss';
</style>
