/* eslint-disable vue/component-definition-name-casing */ /* eslint-disable
vue/multi-word-component-names */

<template>
  <div class="layout" :data-theme="theme">
    <div class="content">
      <Nuxt />
      <div class="footer p-2">
        <div class="items-center grid-flow-col">
          <fa-icon :icon="['fab', 'slack']" class="fa-4x" />
          <p>Copyright © 2021 - All right reserved</p>
        </div>
        <div
          class="grid-flow-col gap-4 md:place-self-center md:justify-self-end"
        >
          <a>
            <fa-icon :icon="['fab', 'youtube']" class="fa-2x" />
          </a>
          <a>
            <fa-icon :icon="['fab', 'facebook']" class="fa-2x" />
          </a>
          <a>
            <fa-icon :icon="['fab', 'twitter']" class="fa-2x" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Generic',

  data() {
    return {
      logo: require('~/assets/img/logo_escuro_width.png'),
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
};
</script>

<style lang="postcss" scoped>
.layout {
  @apply flex bg-base-300 text-base-content min-h-screen w-screen max-w-full;
}

.content {
  @apply flex-auto	flex flex-col;
}

.footer {
  @apply bg-base-200 h-auto shadow-lg m-2 w-auto rounded-lg;
  @apply border-t-2 border-t-primary;
}
</style>
