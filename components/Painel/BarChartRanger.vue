<template>
  <div class="card text-center shadow-2xl m-2">
    <div class="card-body pl-2 pr-1 py-5">
      <div id="chart">
        <ApexChart
          ref="chart"
          type="bar"
          height="260"
          :options="options"
          :series="series"
        ></ApexChart>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'PainelBarChartRanger',
  props: {
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      default: null,
    },
    dataset: {
      type: Object,
      default: null,
    },
    locationName: {
      type: String,
      default: '',
    },
    palette: {
      type: String,
      default: 'field',
    },
  },
  data() {
    return {
      series: [],
      options: {
        chart: {
          type: 'bar',
          height: 260,
        },
        theme: {
          mode: this.$store.state.modeChart,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        colors: Vue.palette[this.palette],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
        },
        title: {
          text: this.title,
          align: 'center',
          floating: true,
        },
      },
      localParams: {},
    };
  },
  async fetch() {
    if (this.dataset != null) {
      this.localParams = { ...this.params };
      await this.getSerie(this.url, this.localParams);
    }
  },
  watch: {
    deep: true,
    immediate: true,
    dataset() {
      // this.getSerie(this.url, this.params);
    },
    params(val) {
      this.localParams = { ...val };
      this.localParams.per_page = this.perPage;
      this.localParams.page = this.currentPage;
      this.getSerie(this.url, this.localParams);
    },
    '$store.state.modeChart'() {
      this.$refs.chart.chart.updateOptions({
        theme: {
          mode: this.$store.state.modeChart,
        },
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
    },
  },
  mounted() {},
  methods: {
    async getSerie(url, params) {
      const categories = [];
      const data = [];

      const result = await this.$axios.get(`${url}/${this.dataset.id}/`, {
        params,
      });

      result.data.forEach((item) => {
        for (const property in item) {
          data.push(item[property]);
          categories.push(property);
        }
      });

      this.$refs.chart.chart.updateOptions({
        series: [
          {
            name: this.title,
            data,
          },
        ],
        xaxis: {
          categories,
        },
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
      this.$emit('loadend');
    },
  },
};
</script>
