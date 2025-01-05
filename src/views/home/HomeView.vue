<template>
  <div class="home__page">
    <HomeBackground :class="expanded ? 'expanded' : ''" />
    <vAscii
      class="home__ascii"
      :class="expanded ? 'expanded' : ''"
      modelPath="/assets/object_to_ascii.obj"
      :asciiConfig="{
        width: 200,
        height: 60,
        chars: ' .:+#@',
        renderWidth: 320,
        renderHeight: 160,
      }"
      :cameraConfig="{
        fov: 15,
        position: { x: 0, y: 0, z: 50 },
      }"
      :controlsConfig="{
        autoRotateSpeed: 4,
        enableZoom: false,
      }"
      :show-debug="false"
    />
    <WelcomeTitle @click="handleWelcomeClick" class="home__welcome-title" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeBackground from './components/HomeBackground/HomeBackground.vue'
import WelcomeTitle from './components/WelcomeTitle/WelcomeTitle.vue'
import vAscii from '../../components/vAscii/vAscii.vue'

const expanded = ref(true)

const handleWelcomeClick = () => {
  if (expanded.value) {
    expanded.value = false
    return
  }
  expanded.value = true
}
</script>

<style scoped lang="scss">
@use './styles.scss';
</style>
