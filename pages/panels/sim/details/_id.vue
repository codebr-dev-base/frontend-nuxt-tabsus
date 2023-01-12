<template>
  <div class="content">
    <div>
      <PainelNavbar :location="initial">
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
      </PainelNavbar>
      <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
        <div>
          <client-only>
            <PainelBarChartPaginate
              title="Óbitos por unidade"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsHealthUnits"
              :url.sync="urlSerie"
            ></PainelBarChartPaginate>
          </client-only>
        </div>
        <div>
          <client-only>
            <PainelBarChartAgePyramid
              title="Pirâmide etária"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByIdade"
              :url.sync="urlSerieRange"
            ></PainelBarChartAgePyramid>
          </client-only>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
        <div>
          <client-only>
            <PainelBarChartPaginate
              title="Óbitos por causa base"
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
              title="Óbitos por causa base"
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
              title="Óbitos por causa base DNC"
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
              title="Óbitos por causa base DNC"
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
              title="Pirâmide etária infantil"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByIdadInfantil"
              :url.sync="urlSerieRange"
            ></PainelBarChartAgePyramid>
          </client-only>
        </div>
        <div>
          <client-only>
            <PainelDonutChartRanger
              title="Por estado civil"
              :dataset.sync="dataset"
              :location-name.sync="locationName"
              :params.sync="paramsSerieByCivil"
              :url.sync="urlSerieRange"
              palette="pastels"
            ></PainelDonutChartRanger>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSimDeails',
  mixins: [filters],
  data() {
    return {
      id: null,
      img: require('~/assets/img/logo_mini_transparent_light.png'),
      initial:
        this.$store.state.sim.initial !== null
          ? this.$store.state.sim.initial
          : 'pi',
      name:
        this.$store.state.sim.locationName !== null
          ? this.$store.state.sim.locationName
          : 'Piauí',
      locationName:
        this.$store.state.sim.locationName !== null
          ? this.$store.state.sim.locationName
          : 'Piauí',
      dataset: null,
      module: 'sim',
      urlBaseSerie: `v1/dataset/serie/datasus/sim/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sim/`,
      urlSerie: '',
      urlSerieRange: '',
      groupedCids: [],
      groupedCidsDnc: [],
      paramsHealthUnits: {
        per: 'codestab',
        rating: 'contador',
        operation: 'count',
      },
      paramsSerieByIdade: {
        per: 'idade',
        rating: 'contador',
        ranger: 'faixa_etaria_pd',
        per_page: 10,
        page: 1,
      },
      paramsSerieByIdadInfantil: {
        per: 'idade',
        rating: 'contador',
        ranger: 'faixa_etaria_inf1',
        per_page: 10,
        page: 1,
      },
      paramsSerieByCid: {
        per: 'causabas',
        rating: 'contador',
        operation: 'count',
        per_page: 6,
      },
      paramsSerieByCidGrouped: {
        per: 'dtobito',
        rating: 'causabas',
        operation: 'count',
        column_filter: ['causabas'],
      },
      paramsSerieByCidDnc: {
        per: 'causabas',
        rating: 'contador',
        operation: 'count',
        dnc: true,
        per_page: 6,
      },
      paramsSerieByCidDncGrouped: {
        per: 'dtobito',
        rating: 'causabas',
        operation: 'count',
        column_filter: ['causabas'],
      },
      paramsSerieByCivil: {
        per: 'estciv',
        operation: 'count',
        ranger: 'estado_civil',
        column_filter: ['idade', 'estciv'],
        term_filter: ['418', '9'],
        operator_filter: ['>=', '!='],
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
      params = this.setFiltersCids(params, this.module, 'causabas');

      return { ...params };
    },
    changeCids(data) {
      this.groupedCids = [...data];
    },
    changeCidsDnc(data) {
      this.groupedCidsDnc = [...data];
    },
    setAllFilters() {
      this.paramsHealthUnits = this.setFilters(this.paramsHealthUnits);
      this.paramsSerieByIdade = this.setFilters(this.paramsSerieByIdade);
      this.paramsSerieByCid = this.setFilters(this.paramsSerieByCid);
      this.paramsSerieByCidDnc = this.setFilters(this.paramsSerieByCidDnc);
      this.paramsSerieByIdadInfantil = this.setFilters(
        this.paramsSerieByIdadInfantil
      );
      this.paramsSerieByCivil = this.setFilters(this.paramsSerieByCivil);
    },
  },
};
</script>
