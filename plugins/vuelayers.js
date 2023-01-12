import Vue from 'vue';
import VueLayers from 'vuelayers';
import 'vuelayers/dist/vuelayers.min.css';

Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326',
});

