<template>
  <div class="content">
    <div>
      <PainelNavbar :location="initial">
        <template #start>
          {{ locationName }}
        </template>
        <template #end>
          <NuxtLink
            :to="`/panels/${module}/rejected/${id}`"
            class="btn btn-sm btn-accent text-center align-middle mr-1"
          >
            AIH Rejeitadas
          </NuxtLink>
          <NuxtLink
            :to="`/panels/${module}/map/${id}`"
            class="btn btn-sm btn-secondary text-center align-middle"
          >
            <fa-icon
              :icon="['far', 'map']"
              class="icon-menu w-4 h-4 stroke-current"
            />
          </NuxtLink>
        </template>
      </PainelNavbar>
      <div class="grid grid-cols-1 gap-1">
        <div>
          <client-only>
            <PainelBarChartPaginate
              title="Número AIH com pagamento recusado"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsRejectedCount"
              :url.sync="urlSerie"
            ></PainelBarChartPaginate>
          </client-only>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-1">
        <div>
          <client-only>
            <PainelBarChartPaginate
              title="Valor AIH com pagamento recusado"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsRejectedSum"
              :url.sync="urlSerie"
              operation="sum"
              :formatter-value="formatterCurrency"
            ></PainelBarChartPaginate>
          </client-only>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
        <div>
          <client-only>
            <PainelBarChartPaginate
              title="AIH por Diagnóstico Principal"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByCid"
              :url.sync="urlSerie"
              @change="changeCids"
            ></PainelBarChartPaginate>
          </client-only>
        </div>
        <div>
          <client-only>
            <PainelLineChartGrouped
              title="AIH por Diagnóstico Principal"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByCidGrouped"
              :url.sync="urlSerie"
              :grouped="groupedCids"
            ></PainelLineChartGrouped>
          </client-only>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
        <div>
          <client-only>
            <PainelBarChartPaginate
              title="AIH por Diagnóstico Principal DNC"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByCidDnc"
              :url.sync="urlSerie"
              @change="changeCidsDnc"
            ></PainelBarChartPaginate>
          </client-only>
        </div>
        <div>
          <client-only>
            <PainelLineChartGrouped
              title="AIH por Diagnóstico Principal DNC"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByCidDncGrouped"
              :url.sync="urlSerie"
              :grouped="groupedCidsDnc"
            ></PainelLineChartGrouped>
          </client-only>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
        <div>
          <client-only>
            <PainelBarChartAgePyramid
              title="Pirâmide etária"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByIdade"
              :url.sync="urlSerieRange"
              :code-sex="{ male: '1', female: '3' }"
            ></PainelBarChartAgePyramid>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSihDeails',
  mixins: [filters],
  data() {
    return {
      id: null,
      img: require('~/assets/img/logo_mini_transparent_light.png'),
      initial:
        this.$store.state.sih.initial !== null
          ? this.$store.state.sih.initial
          : 'pi',
      name:
        this.$store.state.sih.locationName !== null
          ? this.$store.state.sih.locationName
          : 'Piauí',
      locationName:
        this.$store.state.sih.locationName !== null
          ? this.$store.state.sih.locationName
          : 'Piauí',
      dataset: null,
      module: 'sih',
      urlBaseSerie: `v1/dataset/serie/datasus/sih/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sih/`,
      urlSerie: '',
      urlSerieRange: '',
      groupedCids: [],
      groupedCidsDnc: [],
      paramsRejectedCount: {
        per: 'co_erro',
        rating: 'n_aih',
        operation: 'count',
      },
      paramsRejectedSum: {
        per: 'co_erro',
        rating: 'val_tot',
        operation: 'sum',
      },
      paramsSerieByCid: {
        per: 'diag_princ',
        rating: 'n_aih',
        operation: 'count',
        per_page: 6,
      },
      paramsSerieByCidGrouped: {
        per: 'mes_cmpt',
        rating: 'diag_princ',
        operation: 'count',
        column_filter: ['diag_princ'],
      },
      paramsSerieByCidDnc: {
        per: 'diag_princ',
        rating: 'n_aih',
        operation: 'count',
        dnc: true,
        per_page: 6,
      },
      paramsSerieByCidDncGrouped: {
        per: 'mes_cmpt',
        rating: 'diag_princ',
        operation: 'count',
        column_filter: ['diag_princ'],
      },
      paramsSerieByIdade: {
        per: 'idade',
        rating: 'n_aih',
        ranger: 'faixa_etaria2',
        per_page: 10,
        page: 1,
      },
    };
  },
  async fetch() {
    const response = await this.$axios.get(
      `v1/dataset/${this.$route.params.id}`
    );

    this.urlSerie = `${this.urlBaseSerie}${response.data.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${response.data.initial}`;
    this.initial = response.data.initial;

    this.dataset = response.data;

    this.setAllFilters();
  },
  computed: {},
  created() {
    this.id = this.$route.params.id;
  },
  beforeMount() {},
  mounted() {
    this.$nextTick(function () {});
  },
  activated() {},
  updated() {},
  methods: {
    setFilters(params) {
      params = this.setFiltersLocation(params, this.module);
      params = this.setFiltersCids(params, this.module, 'diag_princ');

      return { ...params };
    },
    changeCids(data) {
      this.groupedCids = [...data];
    },
    changeCidsDnc(data) {
      this.groupedCidsDnc = [...data];
    },
    setAllFilters() {
      this.paramsRejectedCount = this.setFilters(this.paramsRejectedCount);
      this.paramsRejectedSum = this.setFilters(this.paramsRejectedSum);
      this.paramsSerieByCid = this.setFilters(this.paramsSerieByCid);
      this.paramsSerieByCidDnc = this.setFilters(this.paramsSerieByCidDnc);
      this.paramsSerieByIdade = this.setFilters(this.paramsSerieByIdade);
    },
    formatterCurrency(val, opt) {
      if (val !== undefined) {
        return (
          opt.w.globals.labels[opt.dataPointIndex] +
          ':  ' +
          val.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          })
        );
      }
    },
  },
};
</script>
