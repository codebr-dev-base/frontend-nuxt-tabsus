<template>
  <div class="card shadow-lg compact side bg-base-100 my-1">
    <div class="p-1 flex justify-end">
      {{ search }}
      <div class="form-control">
        <label class="input-group input-group-md">
          <input
            v-model="search"
            type="text"
            class="input input-bordered input-md"
            @keyup.enter="getRows"
          />
          <span>
            <a @click="getRows">
              <fa-icon icon="magnifying-glass" />
            </a>
          </span>
        </label>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="table w-full table-zebra">
        <thead>
          <tr>
            <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row[keyColumns]">
            <td v-for="(column, index) in columns" :key="index">
              <div v-if="dateColumns.includes(column)">
                {{ row[column] | formatDate }}
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
            <td>
              <ModalDelete
                :id="row[keyColumns]"
                :url="urlBase"
                @delete="getRows"
              />
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
</template>

<script>
import Vue from 'vue';
export default {
  name: 'TableComponent',
  auth: false,
  props: {
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
    urlBase: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      rows: [],
      perPage: 5,
      currentPage: 1,
      totalRows: 0,
      search: '',
      perPageOptions: [5, 10, 50, 100],
      dateColumns: ['created_at', 'updated_at'],
      grid: { display: 'grid', 'grid-template-columns': 'repeat(4, 1fr)', 'overflow-y': 'auto', height: '250px'},
      iconColor: { width: '28px', height: '28px' },
      swatches: [...Vue.palette.metro, ...Vue.palette.field, ...Vue.palette.nights, ...Vue.palette.pastels, ...Vue.palette.brewer1, ...Vue.palette.brewer2],
    };
  },
  computed: {
    url() {
      return `${this.urlBase}${this.genPage()}${this.genSearch()}`;
    },
  },
  mounted() {
    this.getRows();
  },
  methods: {
    genPage() {
      return `?per_page=${this.perPage}&page=${this.currentPage}`;
    },
    genSearch() {
      if (this.search.length > 3) {
        return `&search=${this.search}`;
      } else {
        return '';
      }
    },
    setPage(page) {
      this.currentPage = page;
      this.getRows();
    },
    async getRows() {
      const response = await this.$axios.get(this.url);
      this.rows = await response.data.data;
      this.totalRows = await response.data.total;
    },
    async changeColor(color, id) {
      try {
        await this.$axios.patch(
          `${this.urlBase}/${id}`,
          {
            color,
          },
          {
            timeout: 9999999,
          }
        );
        this.$toast.success(`Cor alterada`, {
          timeout: 30000,
        });
      } catch (error) {
        this.$toast.error(`Desculpe não foi possivel alterada cor`, {
          timeout: 30000,
        });
        return await error.response;
      }
    },
  },
};
</script>
<style lang="postcss" scoped>
.table td,
.table th {
  @apply p-1.5 md:p-4;
}
</style>
