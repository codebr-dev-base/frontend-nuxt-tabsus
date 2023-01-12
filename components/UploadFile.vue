<template>
  <div>
    <div class="card shadow-lg compact side bg-base-100 my-1">
      <div class="flex-row items-center justify-center space-x-4 card-body">
        <form class="w-full" @submit.prevent="onSubmit">
          <div class="form-control">
            <label for="input-files" class="input-group">
              <span class="w-28">Arquivos:</span>
              <textarea
                v-model="textFiles"
                for="input-files"
                name="text-files"
                class="textarea w-full textarea-bordered"
                placeholder="Arquivos"
                @click="$refs.files.click()"
              ></textarea>

              <input
                id="input-files"
                ref="files"
                type="file"
                name="files"
                multiple
                @change="changeFiles"
              />
            </label>
            <label class="label">
              <span class="label-text-alt text-error"> </span>
            </label>
          </div>

          <div class="justify-center card-actions">
            <a class="btn btn-wide btn-primary" @click="updateFiles">
              Enviar
            </a>
          </div>
        </form>
      </div>
    </div>

    <div v-for="(item, index) in filesProcessed" :key="index">
      <div class="card shadow-lg compact side bg-base-100 my-2">
        <div class="flex-row items-center space-x-4 card-body">
          <div class="flex-1">
            <span>Upload do arquivo:</span>
            <progress
              :value="item.progress"
              max="100"
              class="progress progress-secondary"
            ></progress>
            <h3 class="flex card-title">
              <button class="btn btn-ghost btn-circle loading"></button>
              Processando os dados de: {{ item.dataset.name }}
            </h3>
          </div>
          <div class="flex-0">
            <button class="btn btn-ghost btn-circle" @click="removeFile(item)">
              <fa-icon :icon="['far', 'times-circle']" class="fa-3x" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadFileComponent',
  props: {
    resource: {
      type: String,
      default: 'dataset',
    },
    source: {
      type: String,
      default: 'datasus',
    },
    system: {
      type: String,
      default: 'sim',
    },
    initial: {
      type: String,
      default: 'pi',
    },
  },
  data() {
    return {
      textFiles: '',
      files: [],
      filesProcessed: [],
    };
  },
  computed: {
    url() {
      return `v1/${this.resource}/${this.source}/${this.system}/${this.initial}`;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    changeFiles(event) {
      this.files = Array.from(event.target.files);
      this.textFiles = '';
      if (this.files.length > 0) {
        for (const file of this.files) {
          this.textFiles = this.textFiles + ' ' + file.name;
        }
      }
    },
    removeFile(file) {
      const index = this.filesProcessed.indexOf(file);
      this.filesProcessed.splice(index, 1);
    },
    updateFiles() {
      this.filesProcessed = [];

      for (const index in this.files) {
        this.filesProcessed.push({
          index,
          dataset: this.files[index],
          status: 1,
          progress: 0,
        });
      }
      this.filesProcessed.forEach((file) => {
        this.updateFile(file);
      });
    },
    async updateFile(file) {
      try {
        const formData = new FormData();

        formData.append('datasets[]', file.dataset);
        const response = await this.$axios.$post(`${this.url}`, formData, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          },
          timeout: 9999999,
          onUploadProgress: (event) => {
            file.progress = Math.round((event.loaded * 100) / event.total);

            console.log(
              `A imagem ${file.dataset.name} está ${file.progress}% carregada... `
            );
          },
        });
        this.removeFile(file);
        this.$toast.success(`Arquivo ${file.dataset.name} carregado!`, {
          timeout: 30000,
        });
        this.$emit('upload', file);
        console.log(response);
      } catch (error) {
        this.removeFile(file);
        this.$toast.error(
          `Ocorreu erro no carregamento do ${file.dataset.name}!`, {
          timeout: 30000,
        }
        );
        console.log(error);
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
input[type='file'] {
  display: none;
}
</style>
