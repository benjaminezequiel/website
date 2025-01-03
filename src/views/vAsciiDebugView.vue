<template>
  <vAscii
    class="ascii"
    model-path="/assets/object_to_ascii.obj"
    :asciiConfig="{
      width: 200,
      height: 60,
      chars: ' .:+#@',
      renderWidth: 600,
      renderHeight: 300,
    }"
    :cameraConfig="{
      fov: 15,
      position: { x: 0, y: 0, z: 50 },
    }"
    :controlsConfig="{
      autoRotateSpeed: 4,
      enableZoom: true,
    }"
    :show-debug="true"
  ></vAscii>
</template>
<script setup>
import vAscii from '@/components/vAscii/vAscii.vue'
</script>

<style>
/* body {
  background-color: black;
  color: white;
  background-image: unset;
} */
</style>
