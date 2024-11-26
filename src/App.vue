<script setup>
import { RouterLink, RouterView } from 'vue-router'
import WindowManager from '@/components/WindowManager.vue'
</script>

<template>
  <RouterView />
  <WindowManager />
</template>

<style lang="scss">
@use './assets/base.scss';
</style>
