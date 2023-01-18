<template>
  <Overlay :show="loading">
    <div class="drawer drawer-end">
      <input id="filter-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <div>
          <LazyPainelNavbar
            :location="initial"
            :locations="locations"
            @changeLocation="changeLocationState"
          >
            <template #end>
              <label for="filter-drawer" class="btn btn-ghost drawer-button">
                <fa-icon icon="filter" class="icon-menu" />
              </label>
            </template>
          </LazyPainelNavbar>
          <div
            class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-3"
          >
            <div>
              <LazyPainelCardDatasets
                ref="cardDatasets"
                :title.sync="locationName"
                :url.sync="url"
                sort="year"
                system="sim"
                :params.sync="paramsDatasets"
                @checked="changeDatasets"
                @loadend="incrementLoad"
              ></LazyPainelCardDatasets>
            </div>
            <div>
              <client-only>
                <LazyPainelBarChartDataset
                  title="Total de óbitos: "
                  :datasets.sync="checkedDatasets"
                  :location-name.sync="locationName"
                ></LazyPainelBarChartDataset>
              </client-only>
            </div>
            <div>
              <client-only>
                <LazyPainelBarChartGrouped
                  ref="serieByGrouped"
                  title="Óbitos por sexo: "
                  :datasets.sync="checkedDatasets"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieBySexo"
                  :url.sync="urlSerieRange"
                  @loadend="incrementLoad"
                ></LazyPainelBarChartGrouped>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1">
            <div>
              <client-only>
                <LazyPainelLineChart
                  ref="serieByMonth"
                  title="Óbitos por mês: "
                  :datasets.sync="checkedDatasets"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieByMonth"
                  :url.sync="urlSerie"
                  @loadend="incrementLoad"
                ></LazyPainelLineChart>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
            <div>
              <client-only>
                <LazyPainelBarChartDataset
                  title="Total de óbitos causas externas: "
                  :datasets.sync="checkedDatasetExts"
                  :location-name.sync="locationName"
                ></LazyPainelBarChartDataset>
              </client-only>
            </div>
            <div>
              <client-only>
                <LazyPainelBarChartGrouped
                  ref="serieByGrouped"
                  title="Óbitos causas externas por sexo: "
                  :datasets.sync="checkedDatasetExts"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieBySexo"
                  :url.sync="urlSerieRange"
                  @loadend="incrementLoad"
                ></LazyPainelBarChartGrouped>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1">
            <div>
              <client-only>
                <LazyPainelLineChart
                  ref="serieByMonth"
                  title="Óbitos causas externas por mês: "
                  :datasets.sync="checkedDatasetExts"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieByMonth"
                  :url.sync="urlSerie"
                  @loadend="incrementLoad"
                ></LazyPainelLineChart>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
            <div>
              <client-only>
                <LazyPainelBarChartDataset
                  title="Total de óbitos fetais: "
                  :datasets.sync="checkedDatasetFets"
                  :location-name.sync="locationName"
                ></LazyPainelBarChartDataset>
              </client-only>
            </div>
            <div>
              <client-only>
                <LazyPainelBarChartGrouped
                  ref="serieByGrouped"
                  title="Óbitos fetais por sexo: "
                  :datasets.sync="checkedDatasetFets"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieBySexo"
                  :url.sync="urlSerieRange"
                  @loadend="incrementLoad"
                ></LazyPainelBarChartGrouped>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1">
            <div>
              <client-only>
                <LazyPainelLineChart
                  ref="serieByMonth"
                  title="Óbitos fetais por mês: "
                  :datasets.sync="checkedDatasetFets"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieByMonth"
                  :url.sync="urlSerie"
                  @loadend="incrementLoad"
                ></LazyPainelLineChart>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
            <div>
              <client-only>
                <LazyPainelBarChartDataset
                  title="Total de óbitos infantil: "
                  :datasets.sync="checkedDatasetInfs"
                  :location-name.sync="locationName"
                ></LazyPainelBarChartDataset>
              </client-only>
            </div>
            <div>
              <client-only>
                <LazyPainelBarChartGrouped
                  ref="serieByGrouped"
                  title="Óbitos infantil por sexo: "
                  :datasets.sync="checkedDatasetInfs"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieBySexo"
                  :url.sync="urlSerieRange"
                  @loadend="incrementLoad"
                ></LazyPainelBarChartGrouped>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1">
            <div>
              <client-only>
                <LazyPainelLineChart
                  ref="serieByMonth"
                  title="Óbitos infantil por mês: "
                  :datasets.sync="checkedDatasetInfs"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieByMonth"
                  :url.sync="urlSerie"
                  @loadend="incrementLoad"
                ></LazyPainelLineChart>
              </client-only>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
            <div>
              <client-only>
                <LazyPainelBarChartDataset
                  title="Total de óbitos Materno: "
                  :datasets.sync="checkedDatasetMats"
                  :location-name.sync="locationName"
                ></LazyPainelBarChartDataset>
              </client-only>
            </div>
            <div>
              <client-only>
                <LazyPainelLineChart
                  ref="serieByMonth"
                  title="Óbitos Materno por mês: "
                  :datasets.sync="checkedDatasetMats"
                  :location-name.sync="locationName"
                  :params.sync="paramsSerieByMonth"
                  :url.sync="urlSerie"
                  @loadend="incrementLoad"
                ></LazyPainelLineChart>
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
          <div class="card-body grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
            <LazyPainelTableCities
              ref="tableCities"
              :initial.sync="initial"
              :name.sync="name"
              painel="sim"
              :options-scope-location.sync="optionsScopeLocation"
              @changeLocation="changeLocationFilter"
            ></LazyPainelTableCities>
            <LazyPainelCardCids
              :loading.sync="loading"
              store="sim"
              @update="setAllFilters"
            ></LazyPainelCardCids>
          </div>
        </div>
      </div>
    </div>
  </Overlay>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSim',
  mixins: [filters],
  data() {
    return {
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
      scopeLocation: '',
      module: 'sim',
      optionsScopeLocation: [
        { name: 'Residêntes', value: 'codmunres' },
        { name: 'Ocorrência', value: 'codmunocor' },
      ],
      loading: true,
      countLoading: 0,
      limitLoading: 9,
      urlBase: `v1/dataset/datasus/sim/`,
      urlBaseExt: `v1/dataset/year/datasus/simext/`,
      urlBaseFet: `v1/dataset/year/datasus/simfet/`,
      urlBaseInf: `v1/dataset/year/datasus/siminf/`,
      urlBaseMat: `v1/dataset/year/datasus/simmat/`,
      urlBaseSerie: `v1/dataset/serie/datasus/sim/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sim/`,
      url: '',
      urlSerie: '',
      urlSerieRange: '',
      checkedDatasets: [],
      checkedDatasetExts: [],
      checkedDatasetFets: [],
      checkedDatasetInfs: [],
      checkedDatasetMats: [],
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
        scope_location: this.$store.state.sim.scopeLocation,
        per: 'dtobito',
        rating: 'dtobito',
        operation: 'count',
        per_page: 12,
        page: 1,
      },
      paramsSerieBySexo: {
        scope_location: this.$store.state.sim.scopeLocation,
        per: 'sexo',
        operation: 'count',
        ranger: 'sexo',
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

    this.$store.commit(`${this.module}/setLocationName`, {
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
    async changeDatasets(checkedDatasets) {
      this.loading = true;
      this.checkedDatasets = checkedDatasets;

      const dataSetExts = [];
      const dataSetFets = [];
      const dataSetInfs = [];
      const dataSetMats = [];

      for (const checkedDataset of this.checkedDatasets) {
        const responseExt = await this.$axios.get(
          `${this.urlBaseExt}${this.initial}/${checkedDataset.year}`,
          {
            params: this.paramsDatasets,
          }
        );
        dataSetExts.push(responseExt.data);

        const responseFet = await this.$axios.get(
          `${this.urlBaseFet}${this.initial}/${checkedDataset.year}`,
          {
            params: this.paramsDatasets,
          }
        );
        dataSetFets.push(responseFet.data);

        const responseInf = await this.$axios.get(
          `${this.urlBaseInf}${this.initial}/${checkedDataset.year}`,
          {
            params: this.paramsDatasets,
          }
        );
        dataSetInfs.push(responseInf.data);

        const responseMat = await this.$axios.get(
          `${this.urlBaseMat}${this.initial}/${checkedDataset.year}`,
          {
            params: this.paramsDatasets,
          }
        );
        dataSetMats.push(responseMat.data);
      }
      this.checkedDatasetExts = [...dataSetExts];
      this.checkedDatasetFets = [...dataSetFets];
      this.checkedDatasetInfs = [...dataSetInfs];
      this.checkedDatasetMats = [...dataSetMats];
    },
    setFilters(params) {
      params = this.setFiltersLocation(params, this.module);
      params = this.setFiltersCids(params, this.module, 'causabas');

      return { ...params };
    },
    setAllFilters() {
      this.paramsDatasets = { ...this.setFilters(this.paramsDatasets) };
      this.paramsSerieByMonth = this.setFilters(this.paramsSerieByMonth);
      this.paramsSerieBySexo = this.setFilters(this.paramsSerieBySexo);
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
