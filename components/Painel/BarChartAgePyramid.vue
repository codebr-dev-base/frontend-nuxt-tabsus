<template>
  <div class="card text-center shadow-2xl m-2">
    <div class="card-body pl-2 pr-1 py-1">
      <div id="chart">
        <ApexChart
          ref="chart"
          type="bar"
          height="380"
          :options="options"
          :series="series"
        ></ApexChart>
      </div>
    </div>
  </div>
</template>

<script>
import charts from '@/mixins/charts';

export default {
  name: 'BarChartAgePyramid',
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
    palette: {
      type: String,
      default: 'field',
    },
    codeSex: {
      type: Object,
      default() {
        return { male: '1', female: '2' };
      },
    },
  },
  data() {
    return {
      series: [],
      options: {
        chart: {
          type: 'bar',
          height: 440,
          stacked: true,
        },
        colors: ['#008FFB', '#FF4560'],
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '80%',
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#252525'],
            fontSize: '12px',
          },
          formatter: (val, opt) => {
            return (
              Math.abs(val) +
              '% : ' +
              this.series[opt.seriesIndex].absolute[opt.dataPointIndex]
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
          offsetX: 50,
          dropShadow: {
            enabled: true,
            blur: 0.5,
            opacity: 0.5,
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff'],
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        yaxis: {
          min: -20,
          max: 20,
          title: {
            // text: 'Age',
          },
        },
        tooltip: {
          shared: false,
          x: {
            formatter(val) {
              return val;
            },
          },
          y: {
            formatter: (val, opt) => {
              return (
                Math.abs(val) +
                '% : ' +
                this.series[opt.seriesIndex].absolute[opt.dataPointIndex]
              );
            },
          },
        },
        title: {
          text: `${this.title} ${this.locationName}`,
        },
        xaxis: {
          categories: [],
          title: {
            text: 'Porcentagem %',
          },
          labels: {
            formatter(val) {
              return Math.abs(Math.round(val)) + '%';
            },
          },
        },
      },
      direction: {
        left: -1,
        right: 1,
      },
      sex: [
        {
          name: 'Masculino',
          value: this.codeSex.male,
          direction: -1,
          sum: 0,
          data: [],
          percent: [],
          categories: [],
        },
        {
          name: 'Feminino',
          value: this.codeSex.female,
          direction: 1,
          sum: 0,
          data: [],
          percent: [],
          categories: [],
        },
      ],
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
    async params(val, old) {
      // this.renderComponent = false;
      this.localParams = { ...this.params };
      await this.getSerie(this.url, this.localParams);
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
  async mounted() {
    // await this.getSerie(this.url, this.params);
  },
  methods: {
    async getSerie(url, params) {
      let total = 0;
      this.series = [];

      for (let i = 0; i < this.sex.length; i++) {
        const result = await this.$axios.get(`${url}/${this.dataset.id}/`, {
          params: {
            ...params,
            column_filter: ['sexo'],
            term_filter: [this.sex[i].value],
          },
        });

        const data = await result.data;

        for (const prop in data[0]) {
          this.sex[i].categories.push(prop);
          this.sex[i].data.push(data[0][prop]);
          this.sex[i].sum += data[0][prop];
        }

        total += this.sex[i].sum;
      }

      const onePercent = total / 100;

      for (let i = 0; i < this.sex.length; i++) {
        for (let j = 0; j < this.sex[i].data.length; j++) {
          this.sex[i].percent.push(
            (this.sex[i].data[j] / onePercent).toFixed(2) *
              this.sex[i].direction
          );
        }

        this.series.push({
          name: this.sex[i].name,
          data: this.sex[i].percent,
          absolute: this.sex[i].data,
        });
      }

      if (this.options.xaxis.categories.length <= 0) {
        this.options.xaxis.categories = [...this.sex[1].categories];
      }

      this.update({
        ...this.series,
        ...this.options,
        title: {
          text: `${this.title} ${this.locationName}`,
        },
      });
    },
  },
};
</script>
