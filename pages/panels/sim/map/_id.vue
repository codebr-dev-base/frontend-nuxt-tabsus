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
            <div
              v-show="loadMap"
              class="btn btn-primary btn-outline btn-sm loading"
            >
              Carregando...
            </div>
          </div>
          <div class="collapse-content">
            <div class="flex flex-col w-full rounded-box bg-base-100 py-1">
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
        />
      </client-only>
    </Overlay>
  </div>
</template>

<script>
import filters from '@/mixins/filters';
import pageMap from '@/mixins/page_map';

export default {
  name: 'PainelSimMaps',
  mixins: [filters, pageMap],
  data() {
    return {
      id: null,
      mapFeatures: [],
      loadMap: true,
      featureType: 'city',
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
      incidence: false,
      scopeLocation: this.$store.state.sim.scopeLocation,
      optionsScopeLocation: [
        { name: 'Município Residêntes', value: 'codmunres' },
        { name: 'Município Ocorrência', value: 'codmunocor' },
      ],
      urlBaseSerie: `v1/dataset/serie/datasus/sim/`,
      urlBaseSerieRange: `v1/dataset/serie/range/datasus/sim/`,
      urlSerie: '',
      urlSerieRange: '',
      occurrences: [],
      paramsByLocation: {
        per: this.$store.state.sim.scopeLocation,
        operation: 'count',
        page: '1',
        rating: 'contador',
        by_location_type: 'city',
      },
    };
  },

  async fetch() {},
  computed: {},
  watch: {
    mapFeatures() {},
    async featureType(val) {
      this.loadMap = true;
      // this.activeMap = false;
      await this.getFeatures(this.dataset, this.featureType);
      this.paramsByLocation.by_location_type = this.featureType;
      this.paramsByLocation = this.setFilters(this.paramsByLocation);
      await this.getOccurrences(this.dataset);
      // this.activeMap = true;
      this.loadMap = false;
    },
  },
  async created() {
    this.id = this.$route.params.id;
    const response = await this.$axios.get(
      `v1/dataset/${this.$route.params.id}`
    );

    this.urlSerie = `${this.urlBaseSerie}${response.data.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${response.data.initial}`;
    this.initial = response.data.initial;

    this.dataset = response.data;
    await this.getFeatures(response.data, this.featureType);
    this.paramsByLocation = this.setFilters(this.paramsByLocation);
  },
  beforeMount() {},
  mounted() {},
  activated() {},
  updated() {},
  methods: {
    setFilters(params) {
      params = this.setFiltersCids(params, this.module, 'causabas');

      return { ...params };
    },
    changeScopeLocation(per) {
      this.loadMap = true;
      this.scopeLocation = per;
      this.paramsByLocation.per = per;
      this.paramsByLocation = this.setFilters(this.paramsByLocation);
      this.getOccurrences(this.dataset);
    },
    async createdMap() {
      await this.getOccurrences(this.dataset);
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
</style>
