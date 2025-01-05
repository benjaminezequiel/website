// components/WindowManager.vue
<template>
  <div class="window-manager"></div>
</template>

<script setup>
import { ref, onUnmounted, createApp } from 'vue'
import 'winbox/dist/css/winbox.min.css'
import 'winbox/dist/css/themes/modern.min.css'

import WinBox from 'winbox/src/js/winbox'

const windows = ref(new Map())

const createWindow = (id, component, options = {}) => {
  if (windows.value.has(id)) {
    windows.value.get(id).focus()
    return
  }

  const mountPoint = document.createElement('div')
  mountPoint.id = `window-${id}`

  const defaultOptions = {
    title: 'New Window',
    width: '500px',
    height: '400px',
    x: 'center',
    y: 'center',
    class: 'modern',
    mount: mountPoint,
    onclose: () => {
      windows.value.delete(id)
    },
  }

  const winbox = new WinBox({
    ...defaultOptions,
    ...options,
  })

  const app = createApp(component)
  app.mount(mountPoint)

  windows.value.set(id, winbox)

  return winbox
}

onUnmounted(() => {
  windows.value.forEach((window) => window.close())
  windows.value.clear()
})

defineExpose({
  createWindow,
})
</script>

<style>
.window-manager {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.wb-body {
  background-color: black !important;
  overflow-x: hidden;
}

.winbox {
  border: solid 1px gray;
  border-radius: 12px;
}
</style>
