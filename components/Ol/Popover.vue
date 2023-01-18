<template>
  <div class="card bg-base-100 shadow-xl ol-popup">
    <a id="popup-closer" class="ol-popup-closer" @click="close"></a>

    <div v-if="feature.properties" id="card-body popup-content">
      <h2 v-if="feature.properties.name" class="card-title">
        {{ feature.properties.name }}
      </h2>
      <p v-if="feature.properties.name">
        {{ feature.properties.name }}
      </p>
      <p v-if="feature.properties.count">
        Ocorrência: {{ feature.properties.count | locateNumber }}
      </p>
      <p v-if="feature.properties.incidence">
        Incidência: {{ feature.properties.incidence | locateNumber }}
      </p>
      <p v-if="feature.properties.populations">
        População: {{ feature.properties.populations | locateNumber }}
      </p>
      <div class="card-actions justify-end">
        <button class="btn btn-xs btn-primary" @click="close">fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OlPopover',
  props: {
    feature: {
      type: Object,
      required: true,
    },
  },
  methods: {
    close(e) {
      e.target.blur();
      this.$emit('close');
    },
  },
};
</script>
<style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  bottom: 12px;
  left: -50px;
  min-width: 180px;
}

.ol-popup::after,
.ol-popup::before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup::after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup::before {
  border-top-color: #ccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer::after {
  content: '✖';
}
</style>
