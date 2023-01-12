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
        <div class="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-3">
          <div>
            <PainelCardDatasets
              ref="cardDatasets"
              :title.sync="locationName"
              :url.sync="url"
              sort="year"
              system="sih"
              :params.sync="paramsDatasets"
              @checked="changeDatasets"
            ></PainelCardDatasets>
          </div>

          <div class="col-span-2">
            <client-only>
              <PainelBarChartSihDataset
                title="AIH Aprovadas e Rejeitadas"
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
              ></PainelBarChartSihDataset>
            </client-only>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1">
          <div>
            <client-only>
              <PainelBarChartSihValues
                ref="serieByValues"
                title="Valor das AIH Aprovadas e Rejeitadas"
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSerieByValTot"
                :url.sync="urlSerie"
              ></PainelBarChartSihValues>
            </client-only>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <div>
            <client-only>
              <PainelBarChartDataset
                title="Quantidade total de AIH "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
              ></PainelBarChartDataset>
            </client-only>
          </div>
          <div>
            <client-only>
              <PainelLineChart
                ref="serieByMonth"
                title="AIH por mês: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSerieByMonth"
                :url.sync="urlSerie"
              ></PainelLineChart>
            </client-only>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <div>
            <client-only>
              <PainelLineChart
                ref="seriePermanenceByMonth"
                title="Diárias de AIH por mês: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSeriePermanenceByMonth"
                :url.sync="urlSerie"
                operation="sum"
              ></PainelLineChart>
            </client-only>
          </div>
          <div>
            <client-only>
              <PainelLineChart
                ref="serieUtiByMonth"
                title="Diárias de UTI por mês: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSerieUtiByMonth"
                :url.sync="urlSerie"
                operation="sum"
              ></PainelLineChart>
            </client-only>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-1">
          <div>
            <client-only>
              <PainelLineChart
                ref="serieDeathByMonth"
                title="Óbitos por mês: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
                :params.sync="paramsSerieDeathByMonth"
                :url.sync="urlSerie"
                operation="sum"
              ></PainelLineChart>
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
          <PainelTableCities
            ref="tableCities"
            :initial.sync="initial"
            :name.sync="name"
            painel="sih"
            :options-scope-location.sync="optionsScopeLocation"
            @changeLocation="changeLocationFilter"
          ></PainelTableCities>
          <PainelCardCids
            :loading.sync="loading"
            store="sih"
            @update="setAllFilters"
          ></PainelCardCids>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSih',
  mixins: [filters],
  data() {
    return {
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
      scopeLocation: '',
      module: 'sih',
      optionsScopeLocation: [
        { name: 'Residêntes', value: 'munic_res' },
        { name: 'Ocorrência', value: 'munic_mov' },
      ],
      loading: false,
      urlBase: `v1/dataset/datasus/sih/`,
      urlBaseSerie: `v1/dataset/serie/datasus/sih/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sih/`,
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
        scope_location: this.$store.state.sih.scopeLocation,
        per: 'mes_cmpt',
        rating: 'n_aih',
        operation: 'count',
        per_page: 12,
        page: 1,
      },
      paramsSeriePermanenceByMonth: {
        scope_location: this.$store.state.sih.scopeLocation,
        per: 'mes_cmpt',
        rating: 'dias_perm',
        operation: 'sum',
        per_page: 12,
        page: 1,
      },
      paramsSerieUtiByMonth: {
        scope_location: this.$store.state.sih.scopeLocation,
        per: 'mes_cmpt',
        rating: 'uti_mes_to',
        operation: 'sum',
        per_page: 12,
        page: 1,
      },
      paramsSerieDeathByMonth: {
        scope_location: this.$store.state.sih.scopeLocation,
        per: 'mes_cmpt',
        rating: 'morte',
        operation: 'sum',
        per_page: 12,
        page: 1,
      },
      paramsSerieByValTot: {
        scope_location: this.$store.state.sih.scopeLocation,
        per: 'val_tot',
        operation: 'sum',
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
      this.resetFilters('munic_mov');
      this.setAllFilters();
    },
    changeDatasets(checkedDatasets) {
      this.checkedDatasets = checkedDatasets;
    },
    setFilters(params) {
      params = this.setFiltersLocation(params, this.module);
      params = this.setFiltersCids(params, this.module, 'diag_princ');

      return { ...params };
    },

    setAllFilters() {
      this.paramsDatasets = { ...this.setFilters(this.paramsDatasets) };
      this.paramsSerieByMonth = this.setFilters(this.paramsSerieByMonth);
      this.paramsSeriePermanenceByMonth = this.setFilters(this.paramsSeriePermanenceByMonth);
      this.paramsSerieUtiByMonth = this.setFilters(this.paramsSerieUtiByMonth);
      this.paramsSerieDeathByMonth = this.setFilters(this.paramsSerieDeathByMonth);
      this.paramsSerieByValTot = this.setFilters(this.paramsSerieByValTot);
    },
  },
};
</script>
