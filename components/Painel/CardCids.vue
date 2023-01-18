<template>
  <div>
    <div class="navbar-cids">
      <div class="flex-1 px-2 mx-2">
        <span class="text-lg font-bold">
          Cid 10
        </span>
      </div>
      <div class="flex-none"></div>
    </div>
    <div tabindex="0" class="card-collapse collapse-close">
      <div class="collapse-title text-xl font-medium" @click="open">
        Filtro por Capítulo CID 10
      </div>
      <div class="collapse-content">
        <p>
          Classificação de CIDS segundo o capítulo
        </p>
        <InputAutocompleteBadge
          v-model="selectedChaptersCids"
          :options="chaptersCids"
          :sorting-property="'name'"
          index-property="starting_code"
          @change="getChaptersCids"
        ></InputAutocompleteBadge>
        <div class="flex justify-end m-1">
          <button
            class="btn btn-primary"
            :class="{ loading: loading }"
            @click="updateChaptersCids"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
    <div tabindex="0" class="card-collapse collapse-close">
      <div class="collapse-title text-xl font-medium" @click="open">
        Filtro por Grupo CID 10
      </div>
      <div class="collapse-content">
        <p>
          Classificação por grupos do CID 10
        </p>
        <InputAutocompleteBadge
          v-model="selectedGroupsCids"
          :options="groupsCids"
          :sorting-property="'name'"
          index-property="starting_code"
          @change="getGroupsCids"
        ></InputAutocompleteBadge>
        <div class="flex justify-end m-1">
          <button
            class="btn btn-primary"
            :class="{ loading: loading }"
            @click="updateGroupsCids"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
    <div tabindex="0" class="card-collapse collapse-close">
      <div class="collapse-title text-xl font-medium" @click="open">
        Filtro por Categoria/Sub CID 10
      </div>
      <div class="collapse-content">
        <p>
          Classificação por categoria e subcategoria CID 10
        </p>
        <InputAutocompleteBadge
          v-model="selectedCids"
          :options="cids"
          :sorting-property="'description'"
          index-property="code_dot"
          @change="getCids"
        ></InputAutocompleteBadge>
        <div class="flex justify-end m-1">
          <button
            class="btn btn-primary"
            :class="{ loading: loading }"
            @click="updateCids"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PainelCardCids',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedChaptersCids: [],
      chaptersCids: [],
      selectedGroupsCids: [],
      groupsCids: [],
      selectedCids: [],
      cids: [],
    };
  },
  methods: {
    open(event) {
      const cards = document.querySelectorAll('.collapse-open');
      cards.forEach((card) => {
        card.classList.remove('collapse-open');
      });
      // event.target.parentElement.classList.toggle('collapse-close');
      event.target.parentElement.classList.toggle('collapse-open');
    },
    async getChaptersCids(keyword) {
      try {
        if (keyword.length < 3) {
          this.chaptersCids = [];
          return true;
        }

        const result = await this.$axios.get(
          `v1/cid/chapter/?keyword=${keyword}`
        );
        this.chaptersCids = result.data;
      } catch (e) {
        this.$toast.error(`${e}`, {
          timeout: 30000,
        });
      }
    },
    async getGroupsCids(keyword) {
      try {
        if (keyword.length < 3) {
          this.groupsCids = [];
          return true;
        }

        const result = await this.$axios.get(
          `v1/cid/group/?keyword=${keyword}`
        );
        this.groupsCids = result.data;
      } catch (e) {
        await this.$store.dispatch('alerts/error', e);
      }
    },
    async getCids(keyword) {
      try {
        if (keyword.length < 3) {
          this.cids = [];
          return true;
        }

        const result = await this.$axios.get(`v1/cid/?keyword=${keyword}`);
        this.cids = result.data;
      } catch (e) {
        await this.$store.dispatch('alerts/error', e);
      }
    },
    updateChaptersCids() {
      this.$store.commit(`${this.store}/setCids`, {
        filter_cids: null,
      });

      this.$store.commit(`${this.store}/setGroupsCids`, {
        filter_groups_cids: null,
      });

      if (this.selectedChaptersCids.length > 0) {
        const filterChaptersCids = [];

        for (const ranges of this.selectedChaptersCids) {
          filterChaptersCids.push([ranges.starting_code, ranges.final_code]);
        }
        this.$store.commit(`${this.store}/setChaptersCids`, {
          filter_chapters_cids: [...filterChaptersCids],
        });
      }

      this.$emit('update', {
        type: 'chaptersCids',
        data: this.selectedChaptersCids,
      });
    },
    updateGroupsCids() {
      this.$store.commit(`${this.store}/setCids`, {
        filter_cids: null,
      });

      if (this.selectedGroupsCids.length > 0) {
        const filterGroupsCids = [];

        for (const ranges of this.selectedGroupsCids) {
          filterGroupsCids.push([ranges.starting_code, ranges.final_code]);
        }
        this.$store.commit(`${this.store}/setGroupsCids`, {
          filter_groups_cids: [...filterGroupsCids],
        });
      }

      this.$store.commit(`${this.store}/setChaptersCids`, {
        filter_chapters_cids: null,
      });

      this.$emit('update', {
        type: 'groupsCids',
        data: this.selectedGroupsCids,
      });
    },
    updateCids() {
      if (this.selectedCids.length > 0) {
        const filterCids = [];
        for (const cid of this.selectedCids) {
          filterCids.push(cid.code);
        }

        this.$store.commit(`${this.store}/setCids`, {
          filter_cids: [...filterCids],
        });
      }

      this.$store.commit(`${this.store}/setGroupsCids`, {
        filter_groups_cids: null,
      });

      this.$store.commit(`${this.store}/setChaptersCids`, {
        filter_chapters_cids: null,
      });

      this.$emit('update', { type: 'cids', data: this.selectedCids });
    },
  },
};
</script>
<style lang="postcss" scoped>
.card-collapse {
  @apply w-full border rounded-box border-base-300 collapse-arrow;
}

.navbar-cids {
  @apply navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box;
}
</style>
