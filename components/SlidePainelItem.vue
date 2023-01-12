<template>
  <div
    v-on-clickaway="away"
    class="painel"
    :class="{ 'painel-collapsed': !isActive }"
    @click="isActive = !isActive"
  >
    <a
      class="btn btn-xs btn-primary title"
      :class="{ 'title-collapsed': !isActive }"
      >{{ label }}</a
    >
    <slot v-if="isActive"></slot>
  </div>
</template>

<script>
export default {
  name: 'SlidePainelComponent',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'Lista',
    },
  },
  data() {
    return {
      isActive: this.value,
    };
  },
  watch: {
    isActive(currentValue) {
      this.$emit('change', currentValue);
    },
  },
  methods: {
    away() {
      this.isActive = false;
    },
  },
};
</script>
<style lang="postcss" scoped>
.painel {
  min-height: 80vh;
  @apply bg-base-200 shadow-lg rounded-lg border-l-2 border-l-primary flex-auto;
}

.painel-collapsed {
  @apply w-12 flex-initial;
}

.title {
  @apply w-16 -translate-y-1;
}

.title-collapsed {
  @apply rotate-90 translate-y-4 -translate-x-5;
}
</style>
