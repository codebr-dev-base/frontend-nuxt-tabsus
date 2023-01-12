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
  name: 'BarChartSihValues',
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
          formatter(value) {
            if (value !== undefined) {
              return value.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              });
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
            formatter(value) {
              if (value !== undefined) {
                return value.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                });
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
            formatter(value) {
              if (value !== undefined) {
                return value.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                });
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
      const approved = [];
      const rejected = [];
      const categories = [];

      let result;
      for (const dataset of this.datasets) {
        result = await this.$axios.get(`${url}/${dataset.id}/`, {
          params,
        });

        categories.push(`${dataset.year}: ${this.locationName}`);
        approved.push(result.data.approved);
        rejected.push(result.data.rejected);
      }

      this.update({
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
    },
  },
};
</script>
