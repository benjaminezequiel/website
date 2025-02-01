<template>
  <div class="home__background">
    <div class="circle_5 animate-5"></div>
    <div class="circle_4 animate-4"></div>
    <div class="circle_3 animate-3"></div>
    <div class="circle_2 animate-2"></div>
    <div class="circle_1 animate-1"></div>
  </div>
</template>

<style lang="scss">
@use '../../../../styles/utils.scss';

.animate-1,
.animate-2,
.animate-3,
.animate-4,
.animate-5,
.animate-6 {
  animation:
    var(--rotating-animation),
    animate-fade 0.5s var(--_animation-delay);
  animation-fill-mode: backwards;
}

.animate-1 {
  --_animation-delay: 2500ms;
}

.animate-2 {
  --_animation-delay: 2600ms;
}

.animate-3 {
  --_animation-delay: 2700ms;
}

.animate-4 {
  --_animation-delay: 2800ms;
}
.animate-5 {
  --_animation-delay: 2900ms;
}

@keyframes animate-fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.home__background {
  @include utils.center-flex();
  @include utils.prevent-select;
  height: 100%;
  width: 100%;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
  z-index: -1;

  --bg-scale: 0.4;
  &.expanded {
    --bg-scale: 0.8;
  }

  .circle_1,
  .circle_2,
  .circle_3,
  .circle_4,
  .circle_5 {
    border-radius: 100%;
    border: 2px solid var(--gray-100);
    border-style: dashed;
    position: absolute;
    align-self: center;

    &::before {
      content: '';
      width: 32px;
      height: 32px;

      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 100%;
      border: 1px solid;
      border-color: inherit;
    }

    // Base size
    width: 70vh;
    height: 70vh;

    // Use two separate transform properties
    scale: calc(var(--bg-scale) + calc(var(--index) / 4));
    rotate: 0deg;

    will-change: transform, scale;
    transition:
      scale var(--ease-out) 300ms,
      transform var(--ease-out) 300ms;
    --rotating-animation: rotate infinite calc(15s * var(--index)) linear;
    &:hover {
      border-color: var(--sea-green-300);
      transform: scale(1.01);
      // cursor: pointer;
      animation-play-state: paused;
    }
  }

  .circle_1 {
    --index: 1;
  }
  .circle_2 {
    --index: 2;
  }
  .circle_3 {
    --index: 3;
  }
  .circle_4 {
    --index: 4;
  }
  .circle_5 {
    --index: 5;
  }
}

@keyframes rotate {
  to {
    rotate: 360deg;
  }
}
</style>
