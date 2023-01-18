<template>
  <div class="card text-center shadow-2xl m-2">
    <div class="card-body pl-2 pr-1 py-1">
      <div id="chart">
        <ApexChart
          ref="chart"
          type="line"
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
  name: 'PainelLineChartGrouped',
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
    dataset: {
      type: Object,
      default: null,
    },
    locationName: {
      type: String,
      default: '',
    },
    grouped: {
      type: Array,
      default() {
        return [];
      },
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
          height: 320,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        theme: {
          mode: this.$store.state.modeChart,
        },
        colors: Vue.palette[this.palette],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
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
    grouped() {
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
      const series = [];

      let result;
      for (const item of this.grouped) {
        params.term_filter = [item.code];
        result = await this.$axios.get(`${url}/${this.dataset.id}/`, {
          params,
        });

        const data = [];
        result.data.data.forEach((itemData) => {
          data.push(itemData.count);
        });
        series.push({
          name: `${item.code}: ${this.locationName}`,
          data,
        });
      }

      this.update({
        series,
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
      this.$emit('loadend');
    },
  },
};
</script>
