<template>

  <div class="flex justify-center grow content-center">
    <LazyCardImage
      class="w-80"
      :img="piaui"
      title="Piauí"
      value="pi"
      button="Dados"
      desc="Dados vitais, epidemiológicos, hospitalares, e ambulatoriais do estado do Piauí"
      url="/datasets/location/pi"
    ></LazyCardImage>
    <LazyCardImage
      class="w-80"
      :img="maranhao"
      title="Maranhão"
      value="ma"
      button="Dados"
      desc="Dados vitais, epidemiológicos, hospitalares, e ambulatoriais do estado do Maranhão"
      url="/datasets/location/ma"
    ></LazyCardImage>
  </div>
</template>

<script>
export default {
  name: 'IndexDatasets',
  middleware: 'auth',
  data() {
    return {
      logo_mini_light: require('~/assets/img/logo_mini_transparent_light.png'),
      piaui: require('~/assets/img/logos/piaui_logo.png'),
      maranhao: require('~/assets/img/logos/maranhao_logo.png'),
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    isSuperuser() {
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    if (!this.loggedIn) {
      this.$router.push('/login');
    }
  },
};
</script>
