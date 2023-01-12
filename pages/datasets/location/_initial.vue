<template>
  <div class="stats-grid">
    <LazyCardStats
      :url="`/datasets/load/datasus/sinasc/${initial}`"
      :img="img"
      title="DATASUS"
      value="SINASC"
      :desc="`Dados referentes ao ${name}`"
    ></LazyCardStats>
    <LazyCardStats
      :url="`/datasets/location/sim/${initial}`"
      :img="img"
      title="DATASUS"
      value="SIM"
      :desc="`Dados referentes ao ${name}`"
    ></LazyCardStats>
    <LazyCardStats
      :url="`/datasets/location/sih/${initial}`"
      :img="img"
      title="DATASUS"
      value="SIH"
      :desc="`Dados referentes ao ${name}`"
    ></LazyCardStats>
  </div>
</template>

<script>
export default {
  name: 'LocationInitial',
  middleware: 'auth',
  data() {
    return {
      img: require('~/assets/img/logo_mini_transparent_light.png'),
      initial: '',
      name: '',
      locations: [
        {
          initial: 'pi',
          name: 'Piauí',
          img: require('~/assets/img/logos/piaui_logo.png'),
        },
        {
          initial: 'ma',
          name: 'Maranhão',
          img: require('~/assets/img/logos/maranhao_logo.png'),
        },
        {
          initial: 'the',
          name: 'Teresina',
          img: require('~/assets/img/logos/piaui_logo.png'),
        },
      ],
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
  beforeMount() {
    this.initial = this.$route.params.initial;
    this.locations.every((location) => {
      if (location.initial === this.initial) {
        this.name = location.name;
        this.img = location.img;
        return false;
      }
      return true;
    });
  },
};
</script>
<style lang="postcss" scoped>
.stats-grid {
  @apply grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-3;
}
</style>
