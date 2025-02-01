<template>
  <div class="home__background">
    <img src="/public/assets/radial_dashes.svg" alt="" class="radial_dashes" />
    <!-- <div class="circle_5"></div>
    <div class="circle_4"></div>
    <div class="circle_3"></div>
    <div class="circle_2"></div>
    <div class="circle_1"></div> -->
  </div>
</template>

<style lang="scss">
@use '../../../../styles/utils.scss';

.home__background {
  @include utils.center-flex();
  @include utils.prevent-select;
  height: 100%;
  width: 100%;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;

  .circle_1,
  .circle_2,
  .circle_3,
  .circle_4,
  .circle_5 {
    border-radius: 100%;
    border: 2px solid var(--gray-900);
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

    transition:
      scale var(--ease-out) 300ms,
      transform var(--ease-out) 300ms;

    animation: rotate infinite calc(15s * var(--index)) linear;
    &:hover {
      border-color: var(--sea-green-300);
      transform: scale(1.01);
      // cursor: pointer;
      animation-play-state: paused;
    }
  }

  .radial_dashes {
    animation: rotate infinite 60s linear;
  }
  .circle_1 {
    --index: 1;
  }
  .circle_2 {
    --index: 2;
    animation-direction: reverse;
  }
  .circle_3 {
    --index: 3;
  }
  .circle_4 {
    --index: 4;
    animation-direction: reverse;
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
