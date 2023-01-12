<template>
  <div class="drawer drawer-end">
    <input id="filter-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div>
        <PainelNavbar
          :location="initial"
          :locations="locations"
          @changeLocation="changeLocationState"
        >
          <template #end>
            <label for="filter-drawer" class="btn btn-ghost drawer-button">
              <fa-icon icon="filter" class="icon-menu" />
            </label>
          </template>
        </PainelNavbar>
        <div
          class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-3"
        >
          <div>
            <PainelCardDatasets
              ref="cardDatasets"
              :title="locationName"
              :url.sync="url"
              sort="year"
              system="sinasc"
              :params.sync="paramsDatasets"
              @checked="changeDatasets"
            ></PainelCardDatasets>
          </div>
          <div>
            <client-only>
              <PainelBarChartDataset
                title="Total de nascidos vivos: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
              ></PainelBarChartDataset>
            </client-only>
          </div>
          <div>
            <client-only>
              <PainelBarChartGrouped
                ref="serieByGrouped"
                title="Nascidos por sexo: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSerieBySexo"
                :url.sync="urlSerieRange"
              ></PainelBarChartGrouped>
            </client-only>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <div>
            <client-only>
              <PainelLineChart
                ref="serieByMonth"
                title="Nascidos vivos por mês: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSerieByMonth"
                :url.sync="urlSerie"
              ></PainelLineChart>
            </client-only>
          </div>
          <div>
            <client-only>
              <PainelAreaChart
                ref="serieByMonth"
                title="Nascidos com mal formação por mês: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSerieByAnomal"
                :url.sync="urlSerie"
              ></PainelAreaChart>
            </client-only>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label for="filter-drawer" class="drawer-overlay"></label>
      <div
        class="card text-center shadow-2xl w-11/12 menu overflow-y-auto bg-base-100 text-base-content p-1"
      >
        <div class="card-body grid grid-cols-1 gap-1">
          <PainelTableCities
            ref="tableCities"
            :initial.sync="initial"
            :name.sync="name"
            painel="sinasc"
            :options-scope-location.sync="optionsScopeLocation"
            @changeLocation="changeLocationFilter"
          ></PainelTableCities>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSinasc',
  mixins: [filters],
  data() {
    return {
      img: require('~/assets/img/logo_mini_transparent_light.png'),
      initial:
        this.$store.state.sinasc.initial !== null
          ? this.$store.state.sinasc.initial
          : 'pi',
      name:
        this.$store.state.sinasc.locationName !== null
          ? this.$store.state.sinasc.locationName
          : 'Piauí',
      locationName:
        this.$store.state.sinasc.locationName !== null
          ? this.$store.state.sinasc.locationName
          : 'Piauí',
      scopeLocation: '',
      module: 'sinasc',
      optionsScopeLocation: [
        { name: 'Residêntes', value: 'codmunres' },
        { name: 'Ocorrência', value: 'codmunnasc' },
      ],
      loading: false,
      urlBase: `v1/dataset/datasus/sinasc/`,
      urlBaseSerie: `v1/dataset/serie/datasus/sinasc/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sinasc/`,
      url: '',
      urlSerie: '',
      urlSerieRange: '',
      checkedDatasets: [],
      locations: [
        {
          initial: 'pi',
          name: 'Piauí',
          img: require('~/assets/img/logos/piaui_logo.png'),
        },
        {
          initial: 'ma',
          name: 'Maranhão',
          img: require('~/assets/img/logos/maranhao_logo.png'),
        },
      ],
      paramsDatasets: {
        limit: 20,
      },
      paramsSerieByMonth: {
        scope_location: this.$store.state.sinasc.scopeLocation,
        per: 'dtnasc',
        rating: 'dtnasc',
        operation: 'count',
        per_page: 12,
        page: 1,
      },
      paramsSerieBySexo: {
        scope_location: this.$store.state.sinasc.scopeLocation,
        per: 'sexo',
        operation: 'count',
        ranger: 'sexo',
        per_page: 12,
        page: 1,
      },
      paramsSerieByAnomal: {
        scope_location: this.$store.state.sinasc.scopeLocation,
        per: 'dtnasc',
        rating: 'codanomal',
        operation: 'count',
        per_page: 12,
        page: 1,
      },
    };
  },
  computed: {},
  watch: {
    checkedDatasets(val) {
      this.changeDatasets(val);
    },
  },
  created() {
    this.url = `${this.urlBase}${this.initial}`;
    this.urlSerie = `${this.urlBaseSerie}${this.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${this.initial}`;

    this.$store.commit(`sinasc/setLocationName`, {
      locationName: this.locationName,
    });

    this.setAllFilters();
  },
  beforeMount() {},
  mounted() {
    this.$nextTick(function () {});
  },
  activated() {},
  updated() {},
  methods: {
    changeLocationState(initial) {
      this.$store.commit(`${this.module}/setInitial`, {
        initial,
      });
      this.url = `${this.urlBase}${initial}`;
      this.urlSerie = `${this.urlBaseSerie}${initial}`;
      this.urlSerieRange = `${this.urlBaseSerieRange}${initial}`;

      this.locations.every((location) => {
        if (location.initial === initial) {
          this.initial = location.initial;
          this.name = location.name;
          this.locationName = location.name;

          this.$store.commit(`${this.module}/setLocationName`, {
            locationName: this.locationName,
          });
          return false;
        }
        return true;
      });
      this.resetFilters('codmunres');
      this.setAllFilters();
    },
    changeDatasets(checkedDatasets) {
      this.checkedDatasets = checkedDatasets;
    },
    setFilters(params) {
      params = this.setFiltersLocation(params, this.module );

      return { ...params };
    },
    setAllFilters() {
      this.paramsDatasets = this.setFilters(this.paramsDatasets);
      this.paramsSerieByMonth = this.setFilters(this.paramsSerieByMonth);
      this.paramsSerieBySexo = this.setFilters(this.paramsSerieBySexo);
      this.paramsSerieByAnomal = this.setFilters(this.paramsSerieByAnomal);
    },
  },
};
</script>
