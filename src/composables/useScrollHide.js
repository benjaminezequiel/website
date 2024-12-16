// src/composables/useScrollHide.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollHide(threshold = 50) {
  const isHidden = ref(false)
  let lastScrollY = 0
  let ticking = false

  const updateScrollDirection = () => {
    const scrollY = window.scrollY

    if (Math.abs(scrollY - lastScrollY) < threshold) {
      ticking = false
      return
    }

    isHidden.value = scrollY > lastScrollY
    lastScrollY = scrollY
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollDirection()
      })
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll)
    lastScrollY = window.scrollY
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return {
    isHidden,
  }
}
