<template>
  <div>
    <div
      class="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box"
    >
      <div class="px-2 mx-2 navbar-start">
        <span class="text-lg font-bold">
          {{ name }}
        </span>
        <div v-if="optionsScopeLocation.length > 0">
          <div
            v-for="item in optionsScopeLocation"
            :key="item.value"
            class="btn btn-ghost btn-sm rounded-btn m-1"
          >
            {{ item.name }}
            <input
              v-model="scopeLocation"
              :value="item.value"
              type="radio"
              class="toggle toggle-primary ml-2"
              @change="changeScope"
            />
          </div>
        </div>
      </div>
      <div class="hidden px-2 mx-2 navbar-center lg:flex">
        <div class="flex items-stretch"></div>
      </div>
      <div class="navbar-end">
        <div class="form-control">
          <div class="relative text-neutral">
            <input
              v-model="term"
              type="text"
              placeholder="Buscar..."
              class="w-full pr-16 input input-primary input-bordered"
              @click.stop="
                () => {
                  return true;
                }
              "
              @input="searchByName(cities, term)"
            />
            <button
              class="absolute top-0 right-0 rounded-l-none btn btn-primary"
            >
              <fa-icon icon="search" class="icon-menu" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto container-table">
      <table class="table w-full table-zebra table-compact">
        <thead>
          <tr>
            <th>Cidade</th>
            <th>Microrregião</th>
            <th>Mesorregião</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in citiesSearched" :key="item.city_id" class="hover">
            <td>
              <input
                v-model="citiesChecked"
                type="radio"
                class="checkbox"
                :value="item.city_id"
                @change="updateLocation('city', item.city)"
              />
              {{ item.city }}
            </td>
            <td>
              <input
                v-model="microregionsChecked"
                type="radio"
                class="checkbox"
                :value="item.microregion_id"
                @change="updateLocation('microregion', item.microregion)"
              />
              {{ item.microregion }}
            </td>
            <td>
              <input
                v-model="mesoregionsChecked"
                type="radio"
                class="checkbox"
                :value="item.mesoregion_id"
                @change="updateLocation('mesoregion', item.mesoregion)"
              />
              {{ item.mesoregion }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PainelTableCities',
  props: {
    initial: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    painel: {
      type: String,
      default: '',
    },
    optionsScopeLocation: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      cities: [],
      citiesSearched: [],
      citiesChecked: [],
      microregionsChecked: [],
      mesoregionsChecked: [],
      locationName: '',
      locationType: this.$store.state[this.painel].locationType,
      locationId: this.$store.state[this.painel].locationId,
      scopeLocation: this.$store.state[this.painel].scopeLocation,
      term: '',
    };
  },
  async fetch() {
    if (this.initial != null) {
      await this.getCities(this.initial);
    }
  },
  watch: {
    initial(val) {
      if (val != null) {
        this.getCities(val);
        this.citiesChecked = [];
        this.microregionsChecked = [];
        this.mesoregionsChecked = [];
      }
    },
  },
  methods: {
    async getCities(initial) {
      this.cities = [];
      this.citiesSearched = [];

      try {
        const result = await this.$axios.get(
          `v1/location/city?initial=${initial}`
        );

        this.cities = result.data;
        this.citiesSearched = Object.assign({}, this.cities);
      } catch (e) {
        this.$toast.error(`Erro ao carregar as cidades`, {
          timeout: 30000,
        });
      }
    },
    toLower(text) {
      text = text.normalize('NFD').replace(/[\u0300-\u036F]/g, '');
      return text.toString().toLowerCase();
    },
    searchByName(items, term) {
      if (term) {
        items = items.filter((item) => {
          if (this.toLower(item.city).includes(this.toLower(term))) {
            return true;
          } else if (
            this.toLower(item.microregion).includes(this.toLower(term))
          ) {
            return true;
          } else if (
            this.toLower(item.mesoregion).includes(this.toLower(term))
          ) {
            return true;
          }
          return false;
        });
      }
      this.citiesSearched = items;
    },
    updateLocation(locationType = null, name) {
      if (locationType === 'city') {
        this.microregionsChecked = [];
        this.mesoregionsChecked = [];

        this.locationName = `Cidade: ${name}`;
        this.locationType = locationType;
        this.locationId = this.citiesChecked;

        if (this.locationId.length === 0) {
          this.locationType = null;
        }
      } else if (locationType === 'microregion') {
        this.mesoregionsChecked = [];
        this.citiesChecked = [];

        this.locationName = `Microrregião: ${name}`;
        this.locationType = locationType;
        this.locationId = this.microregionsChecked;

        if (this.locationId.length === 0) {
          this.locationType = null;
        }
      } else if (locationType === 'mesoregion') {
        this.microregionsChecked = [];
        this.citiesChecked = [];

        this.locationName = `Mesorregião: ${name}`;
        this.locationType = locationType;
        this.locationId = this.mesoregionsChecked;

        if (this.locationId.length === 0) {
          this.locationType = null;
        }
      }

      this.$store.commit(`${this.painel}/setLocation`, {
        locationType: this.locationType,
        locationId: this.locationId,
        locationName: this.locationName,
      });
      this.$store.commit(`${this.painel}/setScopo`, {
        scopeLocation: this.scopeLocation,
      });

      this.$emit('changeLocation', {
        locationId: this.locationId,
        locationType: this.locationType,
        locationName: this.locationName,
      });
      return true;
    },
    changeScope() {
      this.$store.commit(`${this.painel}/setScopo`, {
        scopeLocation: this.scopeLocation,
      });
      this.$emit('changeLocation', {
        locationId: this.locationId,
        locationType: this.locationType,
        locationName: this.locationName,
      });
    },
  },
};
</script>
<style lang="postcss" scoped>
.container-table {
  height: 68vh;
}

td {
  max-width: 100px;
  white-space: inherit;
}

td > input {
  margin-bottom: -5px;
}
</style>
