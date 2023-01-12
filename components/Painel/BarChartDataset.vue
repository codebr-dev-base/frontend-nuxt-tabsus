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
export default {
  name: 'BarChartDataset',
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
            barHeight: '70%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        colors: [],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff'],
          },
          formatter(val, opt) {
            return (
              opt.w.globals.labels[opt.dataPointIndex] +
              ':  ' +
              val.toLocaleString('pt-BR')
            );
          },
          offsetX: 0,
          dropShadow: {
            enabled: true,
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff'],
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        title: {
          text: `${this.title} ${this.locationName}`,
          align: 'center',
          floating: true,
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false,
          },
          y: {
            title: {
              formatter() {
                return '';
              },
            },
          },
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
      const data = [];
      const categories = [];
      const colors = [];

      for (const dataset of this.datasets) {
        colors.push(dataset.color);
        categories.push(`${dataset.year}: ${this.locationName}`);
        data.push(dataset.total);
      }

      this.$refs.chart.chart.updateOptions({
        series: [
          {
            name: this.title,
            data,
          },
        ],
        colors,
        xaxis: {
          categories,
        },
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
    },
  },
};
</script>
