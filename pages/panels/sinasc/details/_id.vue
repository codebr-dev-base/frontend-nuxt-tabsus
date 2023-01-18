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
        <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <div>
            <client-only>
              <LazyPainelBarChartPaginate
                title="Nascidos vivos por unidade "
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsHealthUnits"
                :url.sync="urlSerie"
                @loadend="incrementLoad"
              ></LazyPainelBarChartPaginate>
            </client-only>
          </div>
          <div>
            <client-only>
              <LazyPainelBarChartPaginate
                title="Nascidos vivos por CBO da mãe "
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsSerieCbo"
                :url.sync="urlSerie"
                @loadend="incrementLoad"
              ></LazyPainelBarChartPaginate>
            </client-only>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
          <div class="md:col-span-2 md:row-span-2">
            <client-only>
              <LazyPainelBarChartRanger
                title="Idade da mãe"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsSerieByIdademae"
                :url.sync="urlSerieRange"
                palette="metro"
                @loadend="incrementLoad"
              ></LazyPainelBarChartRanger>
            </client-only>
          </div>
          <div>
            <client-only>
              <LazyPainelDonutChartRanger
                title="Tipo de gravidez"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsSerieGravidez"
                :url.sync="urlSerieRange"
                palette="pastels"
                @loadend="incrementLoad"
              ></LazyPainelDonutChartRanger>
            </client-only>
          </div>
          <div>
            <client-only>
              <LazyPainelDonutChartRanger
                title="Tipo de parto"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsSerieParto"
                :url.sync="urlSerieRange"
                palette="pastels"
                @loadend="incrementLoad"
              ></LazyPainelDonutChartRanger>
            </client-only>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
          <div>
            <client-only>
              <LazyPainelDonutChartRanger
                title="Por peso do RN"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsSeriePeso"
                :url.sync="urlSerieRange"
                palette="pastels"
                @loadend="incrementLoad"
              ></LazyPainelDonutChartRanger>
            </client-only>
          </div>
          <div>
            <client-only>
              <LazyPainelDonutChartRanger
                title="Por estado civil da mãe"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsSerieEstadoCivil"
                :url.sync="urlSerieRange"
                palette="pastels"
                @loadend="incrementLoad"
              ></LazyPainelDonutChartRanger>
            </client-only>
          </div>
          <div>
            <client-only>
              <LazyPainelPolarChart
                title="Número de consultas pre-natal"
                :dataset.sync="dataset"
                :location-name.sync="locationName"
                :params.sync="paramsSerieConsultas"
                :url.sync="urlSerie"
                palette="pastels"
                @loadend="incrementLoad"
              ></LazyPainelPolarChart>
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
  name: 'PainelSinascDeails',
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
      module: 'sinasc',
      urlBaseSerie: `v1/dataset/serie/datasus/sinasc/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sinasc/`,
      urlSerie: '',
      urlSerieRange: '',
      paramsHealthUnits: {
        per: 'codestab',
        rating: 'contador',
        operation: 'count',
      },
      paramsSerieByIdademae: {
        per: 'idademae',
        operation: 'count',
        ranger: 'idademae',
      },
      paramsSerieCbo: {
        per: 'codocupmae',
        rating: 'contador',
        operation: 'count',
      },
      paramsSerieGravidez: {
        per: 'gravidez',
        operation: 'count',
        ranger: 'tipo_gravidez',
      },
      paramsSerieParto: {
        per: 'parto',
        operation: 'count',
        ranger: 'tipo_parto',
      },
      paramsSeriePeso: {
        per: 'peso',
        operation: 'count',
        ranger: 'peso',
      },
      paramsSerieEstadoCivil: {
        per: 'estcivmae',
        operation: 'count',
        ranger: 'estado_civil',
      },
      paramsSerieConsultas: {
        per: 'consultas',
        operation: 'count',
        rating: 'contador',
        per_page: '15',
      },
      loading: true,
      countLoading: 0,
      limitLoading: 8,
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
      return { ...params };
    },
    setAllFilters() {
      this.paramsHealthUnits = this.setFilters(this.paramsHealthUnits);
      this.paramsSerieByIdademae = this.setFilters(this.paramsSerieByIdademae);
      this.paramsSerieCbo = this.setFilters(this.paramsSerieCbo);
      this.paramsSerieGravidez = this.setFilters(this.paramsSerieGravidez);
      this.paramsSerieParto = this.setFilters(this.paramsSerieParto);
      this.paramsSeriePeso = this.setFilters(this.paramsSeriePeso);
      this.paramsSerieEstadoCivil = this.setFilters(
        this.paramsSerieEstadoCivil
      );
      this.paramsSerieConsultas = this.setFilters(this.paramsSerieConsultas);
    },
    incrementLoad() {
      this.countLoading++;
      if (this.countLoading === this.limitLoading) {
        this.countLoading = 0;
        this.loading = false;
      }
    }
  },
};
</script>
