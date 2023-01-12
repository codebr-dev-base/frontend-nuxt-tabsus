<template>
  <div class="card shadow-lg compact side bg-base-100 my-1">
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>

      <div class="overflow-x-auto m-2">
        <table class="w-full table table-zebra table-compact">
          <thead>
            <tr>
              <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row[keyColumns]"
              class="hover:cursor-pointer hover"
              @click="onSelect(row)"
            >
              <td v-for="(column, index) in columns" :key="index">
                <div v-if="dateColumns.includes(column)">
                  {{ row[column] | formatDate }}
                </div>
                <div v-else-if="column.includes('val')">
                  {{ row[column] | locateCurrency }}
                </div>
                <div v-else-if="column == 'color'">
                  <v-swatches
                    v-model="row[column]"
                    :wrapper-style="grid"
                    :swatch-style="iconColor"
                    :trigger-style="iconColor"
                    :swatches="swatches"
                    @input="changeColor($event, row[keyColumns])"
                  ></v-swatches>
                </div>
                <div v-else>
                  {{ row[column] }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-1 flex justify-end">
          <Pagination
            :per-page.sync="perPage"
            :value.sync="currentPage"
            :total="totalRows"
            @input="setPage"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'DataTable',
  auth: false,
  props: {
    title: {
      type: String,
      default: null,
    },
    headers: {
      type: Array,
      default() {
        return [];
      },
    },
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    keyColumns: {
      type: String,
      default: 'id',
    },
    url: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      required: true,
    },
    dataset: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      rows: [],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      perPageOptions: [5, 10, 50, 100],
      dateColumns: ['created_at', 'updated_at'],
      grid: {
        display: 'grid',
        'grid-template-columns': 'repeat(4, 1fr)',
        'overflow-y': 'auto',
        height: '250px',
      },
      iconColor: { width: '28px', height: '28px' },
      swatches: [
        ...Vue.palette.metro,
        ...Vue.palette.field,
        ...Vue.palette.nights,
        ...Vue.palette.pastels,
        ...Vue.palette.brewer1,
        ...Vue.palette.brewer2,
      ],
    };
  },
  async fetch() {
    if (this.dataset != null) {
      this.localParams = { ...this.params };
      await this.getRows(this.url, this.localParams);
    }
  },
  computed: {},
  watch: {
    deep: true,
    immediate: true,
    dataset() {
      // this.getSerie(this.url, this.params);
    },
    params(val) {
      this.localParams = { ...val };
      if (this.localParams.per_page === undefined) {
        this.localParams.per_page = this.perPage;
      }
      this.localParams.page = this.currentPage;
      this.getRows(this.url, this.localParams);
    },
  },
  mounted() {
    // this.getRows();
  },
  methods: {
    genSearch() {
      if (this.search.length > 3) {
        this.localParams.search = this.search;
      } else {
        delete this.localParams.search;
      }
      this.getRows(this.url, this.localParams);
    },
    setPage(page) {
      this.currentPage = page;
      this.getRows(this.url, this.localParams);
    },
    async getRows(url, params) {
      if (this.localParams.per_page === undefined) {
        this.localParams.per_page = this.perPage;
      }
      params.page = this.currentPage;
      const result = await this.$axios.get(`${url}/${this.dataset.id}/`, {
        params,
      });
      this.rows = await result.data.data;
      this.totalRows = await result.data.total;
    },
    onSelect(item) {
      this.$emit('select', item);
    },
  },
};
</script>
<style lang="postcss" scoped>


.table :where(th, td) {
  white-space: initial;
}
</style>
