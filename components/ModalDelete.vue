<template>
  <div>
    <a
      class="btn btn-error btn-outline btn-circle btn-sm"
      @click="showModal = !showModal"
    >
      <fa-icon :icon="['far', 'trash-alt']" />
    </a>
    <div class="modal" :class="{ 'modal-open': showModal }">
      <div class="modal-box">
        <slot></slot>
        <p>Tem Certeza?</p>
        <div class="modal-action">
          <a class="btn btn-warning" @click="destroy">Sim</a>
          <a class="btn" @click="showModal = !showModal">Não</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalDelete',
  props: {
    url: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    destroy() {
      this.$axios
        .delete(`${this.url}/${this.id}`)
        .then((res) => {
          this.$toast.success(`Dateset apagado`, {
            timeout: 30000,
          });
          console.log(res);
        })
        .catch((err) => {
          this.$toast.success(`Não consegui apagar`, {
            timeout: 30000,
          });
          console.error(err);
        });
      this.showModal = false;
      this.$emit('delete');
    },
  },
};
</script>
