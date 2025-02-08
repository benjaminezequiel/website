<template>
  <div class="home__border">
    <!-- <div class="huge-clip-path"></div> -->
    <!-- <PerformanceMonitor :position="0" :panels="[0, 1, 2]"></PerformanceMonitor> -->
    <div class="home__page">
      <div class="home__content">
        <div class="info_card">
          <div class="last_updated animate-4">
            <span class="info-faint">LAST UPDATED</span>
            <span>2025-02-01 | 19:05:10</span>
          </div>
          <div class="currently_reading animate-5">
            <span class="info-faint">CURRENTLY READING</span>
            <span
              ><a href="https://www.goodreads.com/book/show/841.Emotional_Design" target="_blank">
                Emotional Design, Don Norman
              </a>
            </span>
          </div>
          <div class="copyright animate-6">
            <span class="info-faint">COPYRIGHT</span>
            <span>EZBEN @2025</span>
          </div>
        </div>
        <img src="/assets/logo/ezben.svg" alt="" class="logo-test" />
        <HomeBackground :class="expanded ? 'expanded' : ''" />
        <vAscii
          class="home__ascii animate-ascii-entrance"
          :class="expanded ? 'expanded' : ''"
          modelPath="/assets/inflated_decimated_B.obj"
          :asciiConfig="{
            width: 90,
            height: 55,
            chars: ' .:+#@',
            renderWidth: 200,
            renderHeight: 200,
          }"
          :cameraConfig="{
            fov: 20,
            position: { x: 0, y: 0, z: 20 },
          }"
          :controlsConfig="{
            autoRotateSpeed: 4,
            enableZoom: false,
          }"
          :show-debug="false"
        />
        <WelcomeTitle @click="handleWelcomeClick" class="home__welcome-title" />
      </div>

      <!-- <div class="test-white-strip"></div> -->
    </div>
  </div>
  <!-- <div class="circle-3D"><img src="" alt="" /></div>
  <div class="circle-3D-1"><img src="" alt="" /></div>
  <div class="circle-3D-2"><img src="" alt="" /></div> -->
  <!-- <div class="recently-added">
    <div class="recent-item"></div>
    <div class="recent-item"></div>
    <div class="recent-item"></div>
    <div class="recent-item"></div>
    <div class="recent-item"></div>
  </div> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PerformanceMonitor from '@/components/PerformanceMonitor.vue'
import HomeBackground from './components/HomeBackground/HomeBackground.vue'
import WelcomeTitle from './components/WelcomeTitle/WelcomeTitle.vue'
// import vAscii from '../../components/vAscii/vAscii.vue'
import { defineAsyncComponent } from 'vue'

const vAscii = defineAsyncComponent(() => import('@/components/vAscii/vAscii.vue'))
const expanded = ref(true)

const handleWelcomeClick = () => {
  if (expanded.value) {
    expanded.value = false
    return
  }
  expanded.value = true
}

// const fps = ref(0)
// const rafId = ref()
// const displayvAscii = ref(true)

// let frames = 0
// let lastTime = performance.now()
// const THROTTLE = 0
// onMounted(() => {
//   updateFPS()
// })
// const updateFPS = () => {
//   if (frames++ % THROTTLE === 0) {
//     const currentTime = performance.now()

//     if (currentTime >= lastTime + 1000) {
//       fps.value = Math.round((frames * 1000) / (currentTime - lastTime))
//       if (fps.value > 30) {
//         console.log(fps.value)
//         displayvAscii.value = false
//       }
//       frames = 0
//       lastTime = currentTime
//     }
//   }
//   rafId.value = requestAnimationFrame(updateFPS)
// }
</script>

<style scoped lang="scss">
@use './styles.scss';
</style>
