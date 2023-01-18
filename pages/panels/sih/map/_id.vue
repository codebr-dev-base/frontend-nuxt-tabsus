<template>
  <div class="map-container">
    <Overlay :show="loadMap">
      <!-- map panel, controls -->
      <div class="map-panel rounded-box border-base-200 bg-base-100">
        <div
          class="collapse w-96 collapse-arrow border rounded-box border-base-300 bg-base-100"
        >
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium">
            Controles
            <div v-show="loadMap" class="btn btn-primary btn-outline btn-sm loading">
              Carregando...
            </div>
          </div>
          <div class="collapse-content">
            <div class="flex flex-col w-full rounded-box bg-base-100 py-1">
              <div class="grid card bg-base-200 rounded-box mx-2 my-1">
                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Gráfico</span>
                    <input
                      v-model="featureCharts"
                      type="checkbox"
                      class="toggle toggle-primary"
                      @change="showCharts"
                    />
                  </label>
                </div>
              </div>
              <div class="grid card bg-base-200 rounded-box mx-2 my-1">
                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Cidades</span>
                    <input
                      v-model="featureType"
                      type="radio"
                      value="city"
                      class="radio radio-secondary"
                    />
                  </label>
                  <label class="cursor-pointer label">
                    <span class="label-text">Microgerações</span>
                    <input
                      v-model="featureType"
                      type="radio"
                      value="microregion"
                      class="radio radio-secondary"
                    />
                  </label>
                  <label class="cursor-pointer label">
                    <span class="label-text">Mesorregiões</span>
                    <input
                      v-model="featureType"
                      type="radio"
                      value="mesoregion"
                      class="radio radio-secondary"
                    />
                  </label>
                </div>
              </div>
              <div class="grid card bg-base-200 rounded-box mx-2 my-1">
                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Ocorrência</span>
                    <input
                      v-model="incidence"
                      type="radio"
                      name="incidence"
                      checked="checked"
                      class="toggle toggle-primary"
                      :value="false"
                    />
                  </label>
                </div>
                <div class="form-control">
                  <label class="cursor-pointer label">
                    <span class="label-text">Incidência</span>
                    <input
                      v-model="incidence"
                      type="radio"
                      name="incidence"
                      checked="checked"
                      class="toggle toggle-primary"
                      :value="true"
                    />
                  </label>
                </div>
                <div
                  v-for="option in optionsScopeLocation"
                  :key="option.value"
                  class="form-control"
                >
                  <label class="cursor-pointer label">
                    <span class="label-text">{{ option.name }}</span>
                    <input
                      v-model="scopeLocation"
                      type="radio"
                      name="scope"
                      class="toggle toggle-primary"
                      :value="option.value"
                      @change="changeScopeLocation(option.value)"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--// map panel, controls -->
      <client-only>
        <LazyOlMap
          :map-features.sync="mapFeatures"
          :occurrences.sync="occurrences"
          :incidence.sync="incidence"
          :feature-type.sync="featureType"
          :zoom="6.5"
          :zoom-out="6"
          @create-map="createdMap"
          @selectedFeature="selectedFeature"
        />
      </client-only>
    </Overlay>
  </div>
</template>

<script>
import filters from "@/mixins/filters";
import pageMap from "@/mixins/page_map";
import mapsChart from "@/mixins/maps_chart";
import mapsFlowArrow from "@/mixins/maps_flow_arrow";

export default {
  name: "PainelSihMaps",
  mixins: [filters, pageMap, mapsChart, mapsFlowArrow],
  data() {
    return {
      id: null,
      mapFeatures: [],
      loadMap: true,
      featureType: "city",
      featureCharts: false,
      featureDestinyFlowArrow: null,
      map: null,
      mapFlowArrow: null,
      initial:
        this.$store.state.sih.initial !== null ? this.$store.state.sih.initial : "pi",
      name:
        this.$store.state.sih.locationName !== null
          ? this.$store.state.sih.locationName
          : "Piauí",
      locationName:
        this.$store.state.sih.locationName !== null
          ? this.$store.state.sih.locationName
          : "Piauí",
      dataset: null,
      module: "sih",
      incidence: false,
      scopeLocation: this.$store.state.sih.scopeLocation,
      optionsScopeLocation: [
        { name: "Município Residêntes", value: "munic_res" },
        { name: "Município Ocorrência", value: "munic_mov" },
      ],
      urlBaseSerie: `v1/dataset/serie/datasus/sih/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sih/`,
      urlBaseSerieMap: `v1/dataset/serie/map/datasus/sih/`,
      urlSerie: "",
      urlSerieRange: "",
      urlSerieMap: "",
      occurrences: [],
      dataMapCharts: [],
      dataMapFlowArrows: [],
      paramsByLocation: {
        per: this.$store.state.sih.scopeLocation,
        operation: "count",
        page: "1",
        rating: "n_aih",
        by_location_type: "city",
      },
      paramsCharts: {
        per: "n_aih",
        columns: ["munic_mov", "munic_res"],
      },
      paramsFlowArrows: {
        per: "munic_res",
        operation: "count",
        rating: "n_aih",
      },
    };
  },

  async fetch() {},
  computed: {},
  watch: {
    mapFeatures() {},
    async featureType(val) {
      this.loadMap = true;
      await this.getFeatures(this.dataset, this.featureType);
      this.paramsByLocation.by_location_type = this.featureType;
      this.paramsByLocation = this.setFilters(this.paramsByLocation);
      await this.getOccurrences(this.dataset);
      this.loadMap = false;
    },
  },
  async created() {
    this.id = this.$route.params.id;
    const response = await this.$axios.get(`v1/dataset/${this.$route.params.id}`);

    this.urlSerie = `${this.urlBaseSerie}${response.data.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${response.data.initial}`;
    this.urlSerieMap = `${this.urlBaseSerieMap}${response.data.initial}`;
    this.initial = response.data.initial;

    this.dataset = response.data;
    this.dataset.system = this.module;
    await this.getFeatures(response.data, this.featureType);
    this.paramsByLocation = this.setFilters(this.paramsByLocation);
  },
  beforeMount() {},
  mounted() {},
  activated() {},
  updated() {},
  methods: {
    setFilters(params) {
      params = this.setFiltersCids(params, this.module, "diag_princ");

      return { ...params };
    },
    changeScopeLocation(per) {
      this.loadMap = true;
      this.scopeLocation = per;
      this.paramsByLocation.per = per;
      this.paramsByLocation = this.setFilters(this.paramsByLocation);
      this.getOccurrences(this.dataset);
    },
    async getDataMapCharts(dataset) {
      const response = await this.$axios.get(
        `v1/dataset/serie/map/${dataset.source}/${dataset.system}/${dataset.initial}/${this.$route.params.id}/`,
        {
          params: this.paramsCharts,
        }
      );
      this.dataMapCharts = [...response.data];
    },
    async getDataMapFlowArrows(dataset) {
      const response = await this.$axios.get(
        `v1/dataset/serie/map/${dataset.source}/${dataset.system}/${dataset.initial}/${this.$route.params.id}/`,
        {
          params: this.paramsFlowArrows,
        }
      );
      this.dataMapFlowArrows = [...response.data];
    },
    async showCharts() {
      if (this.featureCharts) {
        await this.getDataMapCharts(this.dataset);
      } else {
        this.dataMapCharts = [];
      }
    },
    setMap(item) {
      this.mapFlowArrow = item;
    },
    async selectedFeature(feature) {
      if (feature != null) {
        if (feature.getProperties().ibge_id_short !== undefined) {
          this.featureDestinyFlowArrow = feature;
          this.paramsFlowArrows.column_filter = ["munic_mov"];
          this.paramsFlowArrows.term_filter = [feature.getProperties().ibge_id_short];
          await this.getDataMapFlowArrows(this.dataset);
          this.featureCharts = false;
          this.dataMapCharts = [];
        } else {
          this.featureDestinyFlowArrow = null;
          this.dataMapFlowArrows = [];
        }
      } else {
        this.featureDestinyFlowArrow = null;
        this.dataMapFlowArrows = [];
      }
      // this.paramsFlowArrows.column_filter = ['munic_mov'];
      // this.paramsFlowArrows.term_filter = [feature.properties.ibge_id_short];

      // console.log(this.$olExt.findPointOnSurface(feature.geometry));

      // await this.getDataMapFlowArrows(this.dataset);
      //  column_filter: ['munic_mov'],
      //  term_filter: ['221100'],
      // this.dataMapFlowArrows = [];
    },
    async createdMap(map) {
      await this.getOccurrences(this.dataset);
      this.map = map;
      this.mapFlowArrow = map;
      // await this.showCharts();
      this.loadMap = false;
    },
  },
};
</script>
<style lang="postcss" scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-panel {
  position: absolute;
  top: 10px;
  right: 40px;
  max-height: 500px;
  width: 22em;
  z-index: 1000;
}

.ol-control.ol-legend-top {
  top: 4.5em;
  bottom: auto;
  left: 0.5em;
  z-index: 1;
  max-height: 90%;
  max-width: 90%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
