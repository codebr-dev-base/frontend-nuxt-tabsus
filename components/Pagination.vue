<template>
  <div class="btn-group">
    <button
      class="btn"
      :class="{ disabled: value === 1, 'no-arrows': value === 1 }"
      @click="prevPage"
    >
      «
    </button>
    <button
      class="btn"
      :class="{ 'btn-active': value === item }"
      v-for="item in range(minPage, maxPage)"
      :key="item"
      @click="changePage(item)"
    >
      {{ item }}
    </button>

    <button
      class="btn"
      :class="{
        disabled: value === totalPages,
        'no-arrows': value === totalPages,
      }"
      @click="nextPage"
    >
      »
    </button>
  </div>
</template>
<script>
export default {
  name: 'PaginationComponent',
  props: {
    noArrows: Boolean,
    pageCount: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      defaultPagesToDisplay: 5,
    };
  },
  computed: {
    totalPages() {
      if (this.pageCount > 0) return this.pageCount;
      if (this.total > 0) {
        return Math.ceil(this.total / this.perPage);
      }
      return 1;
    },
    pagesToDisplay() {
      if (this.totalPages > 0 && this.totalPages < this.defaultPagesToDisplay) {
        return this.totalPages;
      }
      return this.defaultPagesToDisplay;
    },
    minPage() {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage > this.totalPages) {
          return this.totalPages - this.pagesToDisplay + 1;
        }
        return this.value - pagesToAdd;
      } else {
        return 1;
      }
    },
    maxPage() {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage < this.totalPages) {
          return newMaxPage;
        } else {
          return this.totalPages;
        }
      } else {
        return this.pagesToDisplay;
      }
    },
  },
  watch: {
    perPage() {
      // this.$emit("input", 1);
    },
    total() {
      // this.$emit("input", 1);
    },
  },
  methods: {
    range(min, max) {
      const arr = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    },
    changePage(item) {
      this.$emit('input', item);
    },
    nextPage() {
      if (this.value < this.totalPages) {
        this.$emit('input', this.value + 1);
      }
    },
    prevPage() {
      if (this.value > 1) {
        this.$emit('input', this.value - 1);
      }
    },
  },
};
</script>
