<template>
  <Overlay :show="loading">
    <div class="content">
      <div>
        <LazyPainelNavbar :location="initial">
          <template #start>
            {{ locationName }}
          </template>
          <template #end>
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
        </LazyPainelNavbar>
        <div class="grid grid-cols-1 gap-1">
          <div>
            <client-only>
              <LazyPainelBarChartPaginate
                title="Número AIH com pagamento recusado"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsRejectedCount"
                :url.sync="urlSerie"
                @loadend="incrementLoad"
              ></LazyPainelBarChartPaginate>
            </client-only>
          </div>
        </div>
        <div class="flex">
          <div class="grow m-2" :class="{ 'w-1/2': showTable }">
            <client-only>
              <LazyPainelDataTable
                title="Unidades AIH com pagamento recusado"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsRejectedTable"
                :url.sync="urlTable"
                :headers.sync="headersRejectedTable"
                :columns="columnsRejectedTable"
                key-columns="cnes"
                per-page="12"
                @select="onSelect"
                @loadend="incrementLoad"
              ></LazyPainelDataTable>
            </client-only>
          </div>
          <div
            v-show="showTable"
            class="grow m-2"
            :class="{ 'w-1/2': showTable }"
          >
            <client-only>
              <LazyPainelDataTable
                :title="healthUnit"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsRejectedUnitTable"
                :url.sync="urlTable"
                :headers.sync="headersRejectedUnitTable"
                :columns="columnsRejectedUnitTable"
                key-columns="n_aih"
                @loadend="incrementLoad"
              ></LazyPainelDataTable>
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </Overlay>
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
      urlBaseTable: `v1/dataset/serie/table/datasus/sih/`,
      urlSerie: '',
      urlSerieRange: '',
      urlTable: '',
      groupedCids: [],
      groupedCidsDnc: [],
      paramsRejectedCount: {
        per: 'cnes',
        operation: 'count',
        rating: 'co_erro',
      },
      paramsRejectedTable: {
        per: 'cnes',
        ratings: ['co_erro', 'val_tot'],
        operations: ['count', 'sum'],
        columns: ['alias_company_name'],
      },
      headersRejectedTable: ['CNES', 'Nome', 'Quant', 'Valor'],
      columnsRejectedTable: [
        'cnes',
        'alias_company_name',
        'count_co_erro',
        'sum_val_tot',
      ],
      paramsRejectedUnitTable: {
        per: 'cnes',
        columns: ['n_aih', 'mes_cmpt', 'co_erro', 'val_tot', 'description'],
        per_page: 5,
      },
      headersRejectedUnitTable: ['AIH', 'Mês', 'Código', 'Valor', 'Descrição'],
      columnsRejectedUnitTable: [
        'n_aih',
        'mes_cmpt',
        'co_erro',
        'val_tot',
        'description',
      ],
      showTable: false,
      healthUnit: null,
      loading: true,
      countLoading: 0,
      limitLoading: 1,
    };
  },
  async fetch() {
    const response = await this.$axios.get(
      `v1/dataset/${this.$route.params.id}`
    );

    this.urlSerie = `${this.urlBaseSerie}${response.data.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${response.data.initial}`;
    this.urlTable = `${this.urlBaseTable}${response.data.initial}`;
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
      this.paramsRejectedTable = this.setFilters(this.paramsRejectedTable);
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
    onSelect(item) {
      const params = { ...this.paramsRejectedUnitTable };
      this.healthUnit = item.alias_company_name;
      params.column_filter = ['cnes'];
      params.term_filter = [item.cnes];
      this.paramsRejectedUnitTable = { ...params };
      this.showTable = true;
    },
    incrementLoad() {
      this.countLoading++;
      if (this.countLoading === this.limitLoading) {
        this.countLoading = 0;
        this.loading = false;
      }
    },
  },
};
</script>
