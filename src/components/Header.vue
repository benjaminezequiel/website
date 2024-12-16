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
      <span>
        <span>FPS: </span>
        <NumberFlow :value="fps"></NumberFlow>
      </span>
      <span class="divider"> | </span>
      <span>
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

// FPS tracking
const fps = ref(0)
const frames = ref(0)
const lastTime = ref(performance.now())
const rafId = ref(null)

// Time tracking
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let timer = null

// Window dimensions
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

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
    default: 'default.svg', // Add default variant
  }

  return variants[props.variant] || 'default.svg' // Fallback to full.svg if variant is not found
})

const updateFPS = () => {
  frames.value++
  const currentTime = performance.now()

  if (currentTime >= lastTime.value + 1000) {
    fps.value = Math.round((frames.value * 1000) / (currentTime - lastTime.value))
    frames.value = 0
    lastTime.value = currentTime
  }

  rafId.value = requestAnimationFrame(updateFPS)
}

const updateTime = () => {
  const now = new Date()
  hours.value = now.getHours()
  minutes.value = now.getMinutes()
  seconds.value = now.getSeconds()
}

const updateResolution = () => {
  width.value = window.innerWidth
  height.value = window.innerHeight
}

let timerInterval

onMounted(() => {
  window.addEventListener('resize', updateResolution)
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  updateFPS()
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
@use '../styles/utils.scss' as utils;

.header {
  position: absolute;
  width: 100%;
  top: 0;
  align-items: flex-start;
  justify-content: space-between;
  display: flex;
  padding: var(--fluid-space) var(--fluid-space) 0 var(--fluid-space);

  .header--logo-container {
    display: flex;
    align-items: center;
  }

  .header--logo {
    max-width: max(10vw, 120px);
    transition: var(--ease-out) scale 200ms;

    &:hover {
      scale: 1.02;
    }

    &.header--logo-mobile {
      max-width: max(8vw, 48px);
    }
  }

  .header--system_info {
    @include utils.prevent-select;

    text-wrap: nowrap;
    font-variant-numeric: tabular-nums;
    display: flex;
    gap: 12px;
    width: fit-content;
    color: var(--gray-900);

    .divider {
      color: var(--gray-500);
    }
  }
}

@media (max-width: 800px) {
  .header {
    justify-content: space-between;

    .header--system_info {
      flex-direction: column;
      gap: 0px;
      align-items: flex-end;

      .divider {
        display: none;
      }

      span:not(:first-child) {
        margin-top: -4px;
      }
    }
  }
}

.inside_project_page {
  &.header {
    position: fixed;
    max-width: min(93%, 51rem);
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    outline: var(--gray-300) 1px solid;
    background-color: rgba(30, 30, 30, 1);

    padding: 16px;
    border-radius: 8px;
    height: fit-content;
    display: flex;
    align-items: center;
    box-shadow: 0px 4px 12px -2px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    transition:
      bottom var(--ease-out) 500ms,
      left var(--ease-out) 500ms,
      opacity var(--ease-out) 500ms,
      width var(--ease-out) 500ms,
      transform var(--ease-out) 500ms;
  }

  &.header {
    a {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      outline: none;
      margin: 0;
      border-radius: 0;
      height: 32px;
    }

    .header--system_info {
      font-size: 14px;
    }
  }
}
</style>

<style>
.inside_project_page.header.hidden {
  transform: translate(-50%, -150%);
}
</style>
