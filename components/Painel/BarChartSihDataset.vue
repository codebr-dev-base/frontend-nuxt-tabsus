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
  name: 'BarChartSihDataset',
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
          stacked: true,
        },
        theme: {
          mode: this.$store.state.modeChart,
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            barHeight: '70%',
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: 40,
          style: {
            fontSize: '12px',
            colors: ['#2C272E'],
          },
          formatter(val) {
            if (val !== undefined) {
              return val.toLocaleString('pt-BR');
            }
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
        colors: Vue.palette[this.palette],
        stroke: {
          width: 1,
          colors: ['#fff'],
        },
        title: {
          text: `${this.title} ${this.locationName}`,
          align: 'center',
          floating: true,
        },
        xaxis: {
          categories: [],
          labels: {
            formatter(val) {
              if (val !== undefined) {
                return val.toLocaleString('pt-BR');
              }
            },
          },
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter(val) {
              if (val !== undefined) {
                return val.toLocaleString('pt-BR');
              }
            },
          },
        },
        fill: {
          opacity: 1,
        },

      },
    };
  },
  watch: {
    deep: true,
    immediate: true,
    datasets(val) {
      this.updateChart();
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
    updateChart() {
      const approved = [];
      const rejected = [];
      const categories = [];

      for (const dataset of this.datasets) {
        categories.push(`${dataset.year}: ${this.locationName}`);
        approved.push(dataset.approved);
        rejected.push(dataset.rejected);
      }

      this.$refs.chart.chart.updateOptions({
        series: [
          {
            name: 'Aprovados',
            data: approved,
          },
          {
            name: 'Rejeitados',
            data: rejected,
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
