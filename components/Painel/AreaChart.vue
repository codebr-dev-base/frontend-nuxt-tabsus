<template>
  <div class="card text-center shadow-2xl m-2">
    <div class="card-body pl-2 pr-1 py-1">
      <div id="chart">
        <ApexChart
          ref="chart"
          type="area"
          height="320"
          :options="options"
          :series="series"
        ></ApexChart>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import charts from '@/mixins/charts';

export default {
  name: 'PainelLineChart',
  mixins: [charts],
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    button: {
      type: String,
      default: 'Mais',
    },
    url: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      default: null,
    },
    datasets: {
      type: Array,
      required: true,
    },
    locationName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      series: [],
      options: {
        colors: [],
        chart: {
          height: 320,
          type: 'area',
          zoom: {
            enabled: false,
          },
        },
        theme: {
          mode: this.$store.state.modeChart,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
          width: 2,
        },
        markers: {
          size: 3,
          hover: {
            size: 5,
          },
        },
        title: {
          text: `${this.title} ${this.locationName}`,
          align: 'center',
          floating: true,
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: Vue.locale.shortMonths,
        },
      },
    };
  },
  watch: {
    deep: true,
    immediate: true,
    datasets() {
      this.getSerie(this.url, this.params);
    },
    url(val) {
      // this.getSerie(val, this.params);
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
      const colors = [];
      const series = [];

      let result;
      for (const dataset of this.datasets) {
        result = await this.$axios.get(`${url}/${dataset.id}/`, {
          params,
        });

        colors.push(dataset.color);
        const data = [];
        result.data.data.forEach((itemData) => {
          data.push(itemData.count);
        });
        series.push({
          name: `${dataset.year}: ${this.locationName}`,
          data,
        });
      }

      this.update({
        series,
        colors,
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
    },
  },
};
</script>
