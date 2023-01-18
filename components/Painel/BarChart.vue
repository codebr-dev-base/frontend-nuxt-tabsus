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
import Vue from 'vue';

export default {
  name: 'PainelBarChartPaginate',
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
          height: 380,
        },
        theme: {
          mode: this.$store.state.modeChart,
        },
        plotOptions: {
          bar: {
            barHeight: '80%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
              orientation: 'horizontal',
            },
          },
        },
        colors: Vue.palette[this.palette],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#2C272E'],
          },
          formatter(val, opt) {
            return (
              opt.w.globals.labels[opt.dataPointIndex] +
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
          offsetX: 0,
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
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
        title: {
          text: this.title,
          align: 'center',
          floating: true,
        },
        tooltip: {
          theme: 'light',
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
      localParams: {},
      perPage: 10,
      currentPage: 1,
      total: 0,
    };
  },
  async fetch() {
    if (this.dataset != null) {
      this.localParams = { ...this.params };
      await this.getSerie(this.url, this.localParams);
    }
    this.$emit('loadend');
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
    setPage(page) {
      this.currentPage = page;
      this.localParams.per_page =
        this.params.per_page === undefined
          ? this.perPage
          : this.params.per_page;
      this.localParams.page = this.currentPage;
      this.getSerie(this.url, this.localParams);
    },
    async getSerie(url, params) {
      const categories = [];
      const data = [];

      const result = await this.$axios.get(`${url}/${this.dataset.id}/`, {
        params,
      });
      result.data.data.forEach((item) => {
        data.push(item.count);
        categories.push(item.name);
      });

      this.total = await result.data.total;

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
      this.$emit('change', result.data.data);
      this.$emit('loadend');
    },
  },
};
</script>
