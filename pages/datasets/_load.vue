<template>
  <div class="grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-2">
    <UploadFile
      resource="dataset"
      :source="source"
      :system="system"
      :initial="initial"
      @upload="upload"
    ></UploadFile>
    <Table
      ref="table"
      :headers="headers"
      :columns="columns"
      :url-base="urlBase"
    ></Table>
  </div>
</template>

<script>
export default {
  name: 'LoadDatasets',
  data() {
    return {
      source: '',
      system: '',
      initial: '',
      headers: ['id', 'Ano', 'Fonte', 'Cor', 'Update'],
      columns: ['id', 'year', 'source', 'color', 'updated_at'],
      urlBase: '',
    };
  },
  create() {},
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    isSuperuser() {
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    },
  },
  beforeMount() {
    this.source = this.$route.params.source;
    this.system = this.$route.params.system;
    this.initial = this.$route.params.initial;
    this.urlBase = `v1/dataset/${this.source}/${this.system}/${this.initial}`;
  },
  mounted() {},
  methods: {
    upload() {
      this.$refs.table.getRows();
    },
  },
};
</script>
