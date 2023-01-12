<template>
  <div>
    {{ token }}
    {{ $store.state.auth.user }}
  </div>
</template>
<script>
export default {
  auth: false,
  name: 'UserToken',
  components: {},
  layout: 'generic',
  asyncData({ params }) {
    const token = params.token;
    return { token };
  },
  data() {
    return {};
  },
  async mounted() {
    this.$auth.strategy.token.set(this.token);
    const response = await this.$auth.fetchUser();
    this.$auth.setUser(response.data);
  },
};
</script>
