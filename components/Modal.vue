<template>
  <div>
    <a class="btn btn-primary" @click="showModal = !showModal">open modal</a>
    <div class="modal" :class="{ 'modal-open': showModal }">
      <div class="modal-box">
        <slot></slot>
        <div class="modal-action">
          <a href="/components/modal#" class="btn btn-primary">Accept</a>
          <a class="btn" @click="showModal = !showModal">Close</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalComponent',
  data() {
    return {
      showModal: false,
    };
  },
};
</script>
