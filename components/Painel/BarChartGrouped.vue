<template>
  <div class="card text-center shadow-2xl m-2">
    <div class="card-body pl-2 pr-1 py-1">
      <div id="chart">
        <ApexChart
          ref="chart"
          type="bar"
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
          height: 320,
        },
        theme: {
          mode: this.$store.state.modeChart,
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        colors: Vue.palette[this.palette],
        dataLabels: {
          enabled: true,
          offsetX: 40,
          style: {
            fontSize: '12px',
            colors: ['#2C272E'],
          },
          formatter(val, opt) {
            return (
              opt.w.globals.seriesNames[opt.seriesIndex] +
              ':  ' +
              val.toLocaleString('pt-BR')
            );
          },
          background: {
            enabled: true,
            foreColor: '#fff',
            padding: 4,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#fff',
            opacity: 0.5,
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: '#000',
              opacity: 0.45,
            },
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff'],
        },
        title: {
          text: `${this.title} ${this.locationName}`,
          align: 'center',
          floating: true,
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        xaxis: {
          categories: [],
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
      const categories = [];
      const series = [];
      let col = 0;

      let result;
      for (const dataset of this.datasets) {
        result = await this.$axios.get(`${url}/${dataset.id}/`, {
          params,
        });
        result.data.forEach((item) => {
          col = 0;
          for (const property in item) {
            if (series[col] === undefined) {
              series[col] = [];
              series[col].push({
                name: `${property}`,
                data: [],
              });
            }
            if (series[col].data === undefined) {
              series[col].name = `${property}`;
              series[col].data = [];
            }
            series[col].data.push(item[property]);
            col++;
          }
        });
        categories.push(dataset.year);
      }

      this.update({
        series,
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
