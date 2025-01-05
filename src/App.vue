<script setup>
import { computed } from 'vue'
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
</script>

<template>
  <SpeedInsights />
  <RouterView />
  <Nav :active="currentRoute"></Nav>
</template>

<style lang="scss">
@use './styles/index.scss';
</style>
