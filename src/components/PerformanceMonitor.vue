// PerformanceMonitor.vue
<template>
  <div ref="statsContainer"></div>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import Stats from 'stats.js'

export default {
  name: 'PerformanceMonitor',
  props: {
    // Position of the stats panel (0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right)
    position: {
      type: Number,
      default: 0,
    },
    // Which panels to show (0: fps, 1: ms, 2: mb)
    panels: {
      type: Array,
      default: () => [0, 1, 2],
    },
  },
  setup(props) {
    let stats
    const statsInstances = []

    onMounted(() => {
      // Create a Stats instance for each requested panel
      props.panels.forEach((panelType) => {
        const statsInstance = new Stats()
        statsInstance.showPanel(panelType)

        // Position the panel
        const panel = statsInstance.dom
        panel.style.cssText = 'position:fixed;'

        switch (props.position) {
          case 1: // top-right
            panel.style.top = '0px'
            panel.style.right = `${statsInstances.length * 80}px`
            break
          case 2: // bottom-left
            panel.style.bottom = '0px'
            panel.style.left = `${statsInstances.length * 80}px`
            break
          case 3: // bottom-right
            panel.style.bottom = '0px'
            panel.style.right = `${statsInstances.length * 80}px`
            break
          default: // top-left
            panel.style.top = '0px'
            panel.style.left = `${statsInstances.length * 80}px`
        }

        document.body.appendChild(panel)
        statsInstances.push(statsInstance)
      })

      // Start the animation loop
      function animate() {
        statsInstances.forEach((stats) => stats.update())
        requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    })

    onBeforeUnmount(() => {
      // Clean up the stats instances when component is destroyed
      statsInstances.forEach((stats) => {
        if (stats.dom && stats.dom.parentElement) {
          stats.dom.parentElement.removeChild(stats.dom)
        }
      })
    })
  },
}
</script>
