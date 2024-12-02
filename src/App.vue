<script setup>
import { RouterLink, RouterView } from 'vue-router'
import WindowManager from '@/components/WindowManager.vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<template>
  <SpeedInsights />
  <RouterView />
  <WindowManager />
</template>

<style lang="scss">
@use './styles/base.scss';
</style>
