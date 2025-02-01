<template>
  <div class="nav entrance-animation" :class="{ hidden: isHidden && hidable }">
    <div class="message" v-if="(!hideMessage && showMessage) || debug">
      <header>
        <span class="material-symbols-outlined">INFO</span>
        <span>HEY THERE!</span>
        <span class="material-symbols-outlined close" @click="hideMessage = true">close</span>
      </header>
      <section>
        I'm really glad you made it here. Feel free to explore my projects, read some thoughts, or
        just say hi. I hope you find something that inspires you!
      </section>
    </div>
    <RouterLink
      class="nav__item entrance-animation-content home"
      to="/"
      :class="{ active: active === 'home' }"
    >
      <span class="nav__item-icon material-symbols-outlined">home</span>
      <span class="nav__item-label">HOME</span>
    </RouterLink>
    <RouterLink
      class="nav__item entrance-animation-content projects"
      to="/projects"
      :class="{ active: active === 'projects' }"
    >
      <span class="nav__item-icon material-symbols-outlined">design_services</span>
      <span class="nav__item-label">PROJECTS</span>
    </RouterLink>
    <RouterLink
      class="nav__item entrance-animation-content experiments"
      to="/experiments"
      :class="{ active: active === 'experiments' }"
    >
      <span class="nav__item-icon material-symbols-outlined">thread_unread</span>
      <span class="nav__item-label">EXPERIMENTS</span>
    </RouterLink>
    <!-- <RouterLink class="nav__item notes" to="/notes" :class="{ active: active === 'notes' }">
      <span class="nav__item-icon material-symbols-outlined">description</span>
      <span class="nav__item-label">NOTES</span>
    </RouterLink> -->
    <!-- <RouterLink class="nav__item" to="/about" :class="{ active: active === 'about' }">
        <span class="nav__item-icon material-symbols-outlined">sentiment_satisfied </span>
        <span class="nav__item-label">ABOUT ME</span>
      </RouterLink> -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useScrollHide } from '@/composables/useScrollHide'
import { BooleanKeyframeTrack } from 'three'

const { isHidden } = useScrollHide()
const debug = false
const hideMessage = ref(localStorage.getItem('hideWelcomeMessage') !== 'false')

watch(hideMessage, (newValue) => {
  localStorage.setItem('hideWelcomeMessage', newValue)
})

const props = defineProps({
  active: {
    type: String,
    default: 'home',
  },
  showMessage: {
    type: Boolean,
    default: false,
  },
  hidable: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
@use '../../styles/utils.scss' as utils;

@mixin window {
  max-width: 64px * 4;
  background-color: var(--gray-100);
  position: absolute;
  left: calc(50% - calc(64px * 8));
  top: calc(50% - calc(64px * 4));
  border-radius: 8px;
  overflow: hidden;
  outline: var(--gray-200) 1px solid;
  z-index: 100;
  // backdrop-filter: blur(12px);

  header {
    border-bottom: 1px solid var(--gray-200);
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 6px;

    .material-symbols-outlined {
      // color: var(--gray-700);
      font-size: 20px;
    }
    .close {
      position: absolute;
      right: 8px;
      cursor: pointer;
    }
  }
  section {
    padding: 8px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}

.nav {
  color: var(--gray-900);
  position: fixed;
  inset: unset;
  z-index: 10;
  box-shadow: 0px 4px 32px -2px var(--gray-25);
  display: flex;
  flex-direction: row;
  left: 50vw;
  bottom: 16px;
  gap: 8px;
  transform: translate(-50%);
  padding: 8px;
  background-color: var(--gray-100);
  max-width: 100%;
  outline: 1px solid var(--gray-200);
  border-radius: 40px;
  align-items: center;
  justify-content: center;

  .nav__item {
    all: unset;
    cursor: pointer;
    padding: 8px 12px 8px 12px;
    // background-color: var(--gray-400);
    border-radius: 32px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 0px;
    outline: transparent solid 2px;
    transition:
      scale var(--ease-out) 200ms,
      outline var(--ease-out) 200ms,
      box-shadow var(--ease-out) 200ms,
      background-color var(--ease-out) 200ms,
      padding var(--ease-out) 200ms,
      margin var(--ease-out) 200ms;

    &.active {
      background: linear-gradient(in oklch, var(--purple-300), var(--purple-200));
      cursor: default;
      padding-left: 16px;
      padding-right: 16px;
      outline: 1px color-mix(in oklch, var(--gray-400), transparent) solid;
      box-shadow: var(--purple-100) 0px 4px 16px -2px;
    }
    &:hover:not(.active) {
      outline: var(--gray-200) solid 1px;
      background-color: var(--gray-100);
      box-shadow: inset 0px 3px 10px -2px black;

      padding-left: 32px;
      padding-right: 32px;

      > * {
        color: var(--gray-600);
      }
    }
  }

  .nav__item-label {
    text-wrap: nowrap;
    font-size: 22px;
    letter-spacing: 1px;
    font-weight: 500;
    font-family: 'Space Grotesk';
    font-feature-settings: 'ss04' on !important;
    font-variation-settings: 'wght' 500;
    font-weight: 500;
  }

  transition:
    bottom var(--ease-out) 500ms,
    left var(--ease-out) 500ms,
    opacity var(--ease-out) 500ms,
    width var(--ease-out) 500ms,
    transform var(--ease-out) 500ms;

  &.hidden {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
}

// .nav .nav__item:hover:last-child {
//   margin: 0 0 0 8px;
// }

// .nav .nav__item:hover:first-child {
//   margin: 0 8px 0 0;
// }

.message {
  @include window;
  width: 320px;
  min-width: 320px;
  position: absolute;
  inset: unset;
  max-width: unset;

  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  // bottom: var(--space-6);
  // left: var(--space-6);
  max-width: 100%;
}

@media (max-width: 640px) {
  .nav .nav__item:not(.active) {
    padding: 8px 8px;
  }
  .nav .nav__item:not(.active) .nav__item-label {
    display: none;
  }
  .nav .nav__item-icon {
    font-size: 28px;
    color: white;
  }
  .nav {
    gap: 4px;
  }
}

.entrance-animation {
  animation-duration: 800ms;
  animation-name: animate-fade, animate-scale;
  animation-delay: 400ms, 600ms;
  animation-fill-mode: backwards, backwards;
  animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  interpolate-size: allow-keywords;
  overflow: hidden;
}

@keyframes animate-fade {
  0% {
    opacity: 0;
    bottom: -100%;
  }
  100% {
    opacity: 1;
    bottom: 16px;
  }
}

@keyframes animate-scale {
  0% {
    width: 0;
  }
  100% {
    width: auto;
  }
}
</style>
