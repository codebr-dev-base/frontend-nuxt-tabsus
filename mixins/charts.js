export default {
  data() {
    return {};
  },
  methods: {
    update(options, count = 10) {
      this.$nextTick(() => {
        if (this.$refs.chart !== undefined) {
          this.$refs.chart.chart.updateOptions({
            theme: {
              mode: this.$store.state.modeChart,
            },
            ...options,
          });
        } else if (count > 0) {
          setTimeout(() => {
            this.update(options, count - 1);
          }, 500);
        }
      });
    },
  },
};
