<template>
  <div>
    <div v-show="!isToggle" class="animated flip-inx flashcard">
      <div class="card-header">
        <slot name="header-front"></slot>
      </div>
      <div class="card-content center">
        <slot name="front"></slot>
      </div>
      <div class="card-footer">
        <slot name="footer-front"></slot>
      </div>
    </div>
    <div v-show="isToggle" class="animated flip-inx flashcard">
      <div class="card-header">
        <slot name="header-back"></slot>
      </div>
      <div class="card-content center">
        <slot name="back"></slot>
      </div>
      <div class="card-footer">
        <slot name="footer-back"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardFlash',
  props: {
    isToggle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
};
</script>
<style scoped>
.center {
  text-align: center;
}

.flashcard {
  cursor: pointer;
  border-radius: 10px;
  margin: 10px;
  padding: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.flashcard:hover {
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes flip-animation {
  0% {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  100% {
    transform: perspective(400px);
  }
}

.flip-inx {
  backface-visibility: visible !important;
  animation-name: flip-animation;
}
</style>
