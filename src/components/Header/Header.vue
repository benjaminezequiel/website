<template>
  <header class="header" :class="classes">
    <a href="/" class="header--logo-container">
      <!-- Logo selection based on variant prop -->
      <img
        :src="`/assets/logo/${currentLogoVariant}`"
        :alt="alt"
        class="header--logo"
        :class="{ 'header--logo-mobile': isMobileLayout }"
      />
    </a>
    <div class="header--system_info">
      <span class="secondary_info">
        <!-- <span>FPS: </span>
        <NumberFlow :value="fps"></NumberFlow> -->
      </span>
      <span class="divider secondary_info"> | </span>
      <span class="">
        <NumberFlow :value="width"></NumberFlow>
        <span> x </span>
        <NumberFlow :value="height"></NumberFlow>
      </span>
      <span class="divider"> | </span>
      <span>
        <NumberFlow :value="hours" :format="{ minimumIntegerDigits: 2, useGrouping: false }" />
        <span>:</span>
        <NumberFlow :value="minutes" :format="{ minimumIntegerDigits: 2, useGrouping: false }" />
        <span>:</span>
        <NumberFlow :value="seconds" :format="{ minimumIntegerDigits: 2, useGrouping: false }" />
      </span>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import NumberFlow from '@number-flow/vue'
import { useScrollHide } from '@/composables/useScrollHide'
const { isHidden } = useScrollHide()

const classes = computed(() => ({
  inside_project_page: props.type,
  hidden: isHidden.value,
}))

const props = defineProps({
  // Logo variant to display: 'full', 'minimal', 'icon', or 'responsive'
  variant: {
    type: String,
    default: 'default',
  },
  type: {
    type: Boolean,
    default: false,
  },
  // Alt text for the logo
  alt: {
    type: String,
    default: 'Logo',
  },
  // Breakpoint for mobile layout (in pixels)
  mobileBreakpoint: {
    type: Number,
    default: 800,
  },
})

// Time tracking

// Window dimensions

// Computed property to determine if mobile layout should be used
const isMobileLayout = computed(() => width.value <= props.mobileBreakpoint)

// Computed property to determine which logo variant to show
const currentLogoVariant = computed(() => {
  if (props.variant === 'responsive') {
    return isMobileLayout.value ? 'icon_logo.svg' : 'full_logo.svg'
  }

  const variants = {
    full: 'full.svg',
    minimal: 'minimal.svg',
    icon: 'linear.svg',
    default: 'ezben.svg', // Add default variant
  }

  return variants[props.variant] || 'ezben.svg' // Fallback to full.svg if variant is not found
})

onMounted(() => {
  updateTime()
  timerInterval = setInterval(updateTime, 1000)

  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('resize', updateResolution)
  if (timerInterval) clearInterval(timerInterval)
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
  }
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>

<style>
.inside_project_page.header.hidden {
  transform: translate(-50%, -150%);
}
@media (max-width: 800px) {
  .secondary_info {
    display: none !important;
  }
}
</style>
