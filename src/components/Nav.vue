<template>
  <div class="nav">
    <div class="message" v-if="showMessage && hideMessage">
      <header>
        <span class="material-symbols-outlined">INFO</span>
        <span>HEY THERE!</span>
        <span class="material-symbols-outlined close" @click="hideMessage = false">close</span>
      </header>
      <section>
        I'm really glad you made it here. Feel free to explore my projects, read some thoughts, or
        just say hi. I hope you find something that inspires you!
      </section>
    </div>
    <RouterLink class="nav__item home" to="/" :class="{ active: active === 'home' }">
      <span class="nav__item-icon material-symbols-outlined">home</span>
      <span class="nav__item-label">HOME</span>
    </RouterLink>
    <RouterLink
      class="nav__item projects"
      to="/projects"
      :class="{ active: active === 'projects' }"
    >
      <span class="nav__item-icon material-symbols-outlined">design_services</span>
      <span class="nav__item-label">PROJECTS</span>
    </RouterLink>
    <!-- <RouterLink class="nav__item notes" to="/field_notes" :class="{ active: active === 'notes' }">
      <span class="nav__item-icon material-symbols-outlined">description </span>
      <span class="nav__item-label">NOTES</span>
    </RouterLink> -->
    <!-- <RouterLink
      class="nav__item experiments"
      to="/experiments"
      :class="{ active: active === 'experiments' }"
    >
      <span class="nav__item-icon material-symbols-outlined">thread_unread </span>
      <span class="nav__item-label">EXPERIMENTS</span>
    </RouterLink> -->
    <!-- <RouterLink class="nav__item" to="/about" :class="{ active: active === 'about' }">
      <span class="nav__item-icon material-symbols-outlined">sentiment_satisfied </span>
      <span class="nav__item-label">ABOUT ME</span>
    </RouterLink> -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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
})
</script>

<style lang="scss" scoped>
@use '../styles/utils.scss' as utils;

@mixin window {
  max-width: 64px * 4;
  background-color: var(--gray-200);
  position: absolute;
  left: calc(50% - calc(64px * 8));
  top: calc(50% - calc(64px * 4));
  border-radius: 8px;
  overflow: hidden;
  outline: var(--gray-300) 1px solid;
  z-index: 100;
  // backdrop-filter: blur(12px);

  header {
    border-bottom: 1px solid var(--gray-300);
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
  color: var(--gray-1200);
  position: fixed;
  inset: unset;
  z-index: 10;
  box-shadow: 0px 4px 32px -2px var(--gray-100);

  .nav__hidden-area {
    position: absolute;
    width: 100%;
    height: 75%;
    top: -100%;
    left: 0;
    right: 0;
    cursor: pointer;
    transition: opacity var(--ease-out) 300ms;
    background: radial-gradient(
      ellipse at bottom center,
      var(--brand-color-3) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    opacity: 0;

    &:hover {
      opacity: 0.2;
    }
  }

  display: flex;
  flex-direction: row;
  left: 50%;
  bottom: 16px;
  gap: 8px;
  transform: translate(-50%);
  padding: 8px;
  background-color: var(--gray-200);
  max-width: 100%;
  outline: 1px solid var(--gray-400);
  border-radius: 40px;

  // .nav__item-icon {
  //   font-size: 26px;
  //   color: var(--gray-200);
  //   opacity: 0;
  //   position: absolute;
  //   bottom: 20px;
  //   transition:
  //     bottom var(--ease-out) 300ms,
  //     opacity var(--ease-out) 300ms,
  //     color var(--ease-out) 300ms,
  //     scale var(--ease-out) 300ms;
  // }

  .nav__item {
    @include utils.add_states(var(--gray-400), var(--brand-color-3));

    all: unset;
    cursor: pointer;
    padding: 8px 20px 8px 16px;
    background-color: var(--gray-400);
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
      transform var(--ease-out) 200ms,
      box-shadow var(--ease-out) 200ms,
      background-color var(--ease-out) 200ms,
      padding var(--ease-out) 200ms,
      margin var(--ease-out) 200ms;

    &.active {
      background-color: var(--brand-color-3);
      cursor: default;
    }
    &:hover {
      outline: var(--gray-300) solid 1px;
      background-color: var(--brand-color-3);
    }
  }
  // &:hover {
  //   .nav__hide {
  //     opacity: 1;
  //     right: -32px;
  //   }
  // }
  // .nav__hide {
  //   color: var(--gray-400);
  //   cursor: pointer;
  //   position: absolute;
  //   right: -24px;
  //   top: 50%;
  //   transform: translateY(-50%);
  //   opacity: 0;
  //   transition:
  //     scale var(--ease-out) 200ms,
  //     right var(--ease-out) 200ms;
  // }

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
    bottom var(--ease-out) 200ms,
    left var(--ease-out) 200ms,
    opacity var(--ease-out) 200ms,
    width var(--ease-out) 800ms;

  &.hidden {
    background: transparent;
    bottom: -72px;
    .nav__item {
      opacity: 0;
    }
  }
}

.nav .nav__item:hover:not(.active) {
  padding-left: 32px;
  padding-right: 32px;
  .material-symbols-outlined {
    color: var(--gray-1000);
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

@media (max-width: 1200px) {
  .nav .nav__item {
    padding: 8px 8px;
  }
  .nav .nav__item-label {
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
</style>
