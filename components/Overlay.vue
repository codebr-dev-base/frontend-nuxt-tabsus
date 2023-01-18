<template>
  <div class="relative">
    <div v-if="show" wire:loading class="overlay-content">
      <div class="btn btn-primary btn-outline btn-lg loading">
        Carregando...
      </div>
    </div>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'OverlayComponent',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="postcss" scoped>
.overlay {
  @apply fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center;
}

.overlay-content {
  @apply absolute bg-gray-700 bg-opacity-75 z-50 h-full w-full flex items-center justify-center
}

.loader {
  border-top-color: #3498db;
  animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
