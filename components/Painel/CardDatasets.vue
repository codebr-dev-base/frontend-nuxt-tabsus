<template>
  <div class="card text-center shadow-2xl m-2">
    <div class="card-body pl-2 pr-1 py-1">
      <h2 class="card-title">{{ title }}</h2>
      <div class="overflow-y-auto h-72">
        <table class="table w-full table-zebra table-compact">
          <thead>
            <tr>
              <th :class="sortedClass('year')" @click="sortBy('year')">
                Ano
              </th>
              <th :class="sortedClass('total')" @click="sortBy('total')">
                Total
              </th>
              <th>Check</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rowsSorted" :key="row.id">
              <td>
                <div
                  class="badge badge-primary"
                  :style="`background-color: ${row.color}; border-color: transparent`"
                >
                  {{ row.year }}
                </div>
              </td>
              <td>{{ row.total | locateNumber }}</td>
              <td>
                <input
                  v-model="checkedDatasets"
                  :value="row.id"
                  type="checkbox"
                  class="toggle-primary toggle"
                />
              </td>
              <td>
                <NuxtLink
                  :to="`/panels/${system}/map/${row.id}`"
                  class="btn btn-sm btn-secondary text-center align-middle"
                >
                  <fa-icon
                    :icon="['far', 'map']"
                    class="icon-menu w-4 h-4 stroke-current"
                  />
                </NuxtLink>
                <NuxtLink
                  :to="`/panels/${system}/details/${row.id}`"
                  class="btn btn-sm btn-primary text-center align-middle"
                >
                  <fa-icon
                    :icon="['far', 'plus-square']"
                    class="icon-menu w-4 h-4 stroke-current"
                  />
                  <fa-icon
                    icon="chevron-right"
                    class="icon-menu w-4 h-4 ml-2 stroke-current"
                  />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PainelCardDatasets',
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    button: {
      type: String,
      default: 'Mais',
    },
    system: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: '',
    },
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      rows: [],
      checkedDatasets: [],
      currentSort: 'year',
      currentSortDir: 'desc',
    };
  },
  async fetch() {
    const response = await this.$axios.get(`${this.url}`, {
      params: this.params,
    });
    this.rows = await response.data;
    this.checkedDatasets = [];
    for (let index = 0; index < 3; index++) {
      this.checkedDatasets.push(this.rows[index].id);
    }
  },
  computed: {
    rowsSorted() {
      const rows = [...this.rows];
      return rows.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === 'desc') modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
  watch: {
    deep: true,
    immediate: true,
    url(newUrl, oldUrl) {
      if (newUrl !== oldUrl) {
        this.getRows(newUrl, this.params);
      }
    },
    params(newParams, oldParams) {
      this.getRows(this.url, newParams);
    },
    checkedDatasets() {
      const datasets = [];
      this.rows.forEach((row) => {
        this.checkedDatasets.forEach((checked) => {
          if (checked === row.id) {
            datasets.push(row);
          }
        });
      });
      this.$emit('checked', datasets);
    },
  },
  async mounted() {},
  methods: {
    sortedClass(key) {
      return this.currentSort === key
        ? `sorted ${this.currentSortDir === 'asc' ? 'desc' : 'asc'}`
        : '';
    },
    sortBy(key) {
      if (key === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = key;
    },
    async getRows(url, params) {
      const response = await this.$axios.get(`${url}`, {
        params,
      });
      this.rows = await response.data;
      this.checkedDatasets = [];
      for (let index = 0; index < 3; index++) {
        this.checkedDatasets.push(this.rows[index].id);
      }
    },
  },
};
</script>
<style lang="postcss" scoped>
th.sorted.asc::after {
  display: inline-block;
  content: '▼';
}

th.sorted.desc::after {
  display: inline-block;
  content: '▲';
}

td {
  @apply px-1;
}
</style>
