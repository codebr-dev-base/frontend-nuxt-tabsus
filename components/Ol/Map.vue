<template>
  <div ref="container">
    <div ref="map" class="map" :style="mapStyle" @resize="resize"></div>

    <OlPopover
      v-show="showPopover"
      id="popover"
      ref="popover"
      :feature="featureSelected"
      @close="closerPopover"
    />
  </div>
</template>

<script>
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import { Select } from 'ol/interaction';
import { getCenter } from 'ol/extent';

import maps from '@/mixins/maps';
import 'ol/ol.css';
// import Map from 'ol/Map';
export default {
  name: 'OlMap',
  mixins: [maps],

  props: {
    mapFeatures: {
      type: Array,
      required: true,
    },
    featureType: {
      type: String,
      required: true,
    },
    occurrences: {
      type: Array,
      required: true,
    },
    incidence: {
      type: Boolean,
      required: true,
    },
    zoom: {
      type: Number,
      default: 4,
    },
    zoomOut: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      source: null,
      vector: null,
      tileOSM: null,
      map: null,
      features: [],
      featuresHover: [],
      showPopover: false,
      selectedfeature: null,
      featureSelected: {},
      overlayPopup: null,
    };
  },
  watch: {
    mapFeatures(val) {
      this.map.getView().setZoom(this.zoom);
      this.features = [...val];
      this.updateFeatures(this.features);
    },
    occurrences(val) {
      this.map.getView().setZoom(this.zoom);
      this.updatedOccurrences(val);
    },
    ranges(val) {
      this.updatedLegend(val, this.map);
    },
    incidence() {
      this.updateFeature(this.occurrences);
    },
  },
  mounted() {
    this.initiateMap();
  },
  methods: {
    initiateMap() {
      const style = this.styleBase;

      this.source = new VectorSource({
        features: this.features,
        style,
      });

      this.vector = new VectorLayer({
        source: this.source,
        style(feature) {
          style.getText().setText(feature.get('name').toString());
          return style;
        },
        wrapX: false,
      });

      this.sourceHover = new VectorSource({
        features: this.featuresHover,
        style,
      });

      this.vectorHover = new VectorLayer({
        source: this.sourceHover,
        style(feature) {
          style.getText().setText(feature.get('name').toString());
          return style;
        },
        wrapX: false,
      });

      this.tileOSM = new TileLayer({
        source: new OSM(),
      });

      this.map = new Map({
        target: this.$refs.map,
        layers: [this.tileOSM, this.vector, this.vectorHover],
        view: new View({
          projection: 'EPSG:4326',
          center: [-69.6689969, -13.7049651],
          zoom: this.zoom,
        }),
      });

      let selected = null;

      this.map.on('pointermove', (e) => {
        this.sourceHover.clear();
        if (selected !== null) {
          // selected.setStyle(undefined);
          selected = null;
        }

        this.map.forEachFeatureAtPixel(e.pixel, function (f) {
          selected = f;
          return true;
        });

        if (selected) {
          const hover = selected.clone();
          hover.setStyle(this.styleBase.clone());
          hover.getStyle().getText().setText(selected.get('name').toString());
          this.sourceHover.addFeature(hover);
        }
      });

      this.source.on('addfeature', () => {
        if (!this.add) {
          this.$emit('featuresload', false);
          this.map.getView().fit(this.features[0].getGeometry());
          this.map
            .getView()
            .animate({ zoom: this.map.getView().getZoom() - this.zoomOut });
        }
      });

      this.map.on('loadend', this.loadend);

      this.overlayPopup = new Overlay({
        element: this.$refs.popover.$el,
      });
      this.map.addOverlay(this.overlayPopup);

      this.selectedfeature = new Select({
        wrapX: false,
        style: this.styleBase.clone().getText().setText('Select'),
      });

      this.selectedfeature.on('select', (e) => {
        this.showPopover = false;
        if (e.selected.length > 0) {
          this.featureSelected = new GeoJSON().writeFeatureObject(
            e.selected[0]
          );
          // .writeFeatureObject(e.selected[0]);
          const coordinates = e.selected[0].getGeometry().getExtent();
          this.overlayPopup.setPosition(getCenter(coordinates));
          this.$emit('selectedFeature', e.selected[0]);
          this.showPopover = true;
        }
      });
      this.map.addInteraction(this.selectedfeature);

      this.setPrintMap(this.map);
    },
    resize() {
      setTimeout(() => {
        this.map.updateSize();
      }, 500);
    },
    updateFeatures(mapFeatures) {
      if (this.source !== null) {
        this.source.clear();
      }

      const geoJsonfeatures = {
        type: 'FeatureCollection',
        name: this.featureType,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:EPSG::4326' },
        },
        features: mapFeatures,
      };

      this.features = new GeoJSON().readFeatures(geoJsonfeatures);

      this.source.addFeatures(this.features);
    },
    updateFeature(occurrences) {
      let feature = null;

      for (const location of occurrences) {
        feature = this.findFeature(location);

        if (feature !== null) {
          this.coloringMap(feature, location);
        }
      }
    },
    findFeature(occurrence) {
      let feature = null;

      if (occurrence.ibge_id.toString().length === 6) {
        feature = this.source.forEachFeature((f) => {
          if (f.getProperties().ibge_id_short === occurrence.ibge_id) {
            return f;
          }
        });
      } else {
        feature = this.source.forEachFeature((f) => {
          if (f.getProperties().ibge_id === occurrence.ibge_id) {
            return f;
          }
        });
      }

      return feature;
    },
    updatedOccurrences(occurrences) {
      try {
        let feature = null;
        const serieCount = [];
        const serieIncidence = [];

        this.source.forEachFeature((fm) => {
          fm.setStyle(this.styleBase);
          fm.getStyle().fill = this.styleBase.fill;
          fm.getStyle().stroke = this.styleBase.stroke;
          fm.setProperties({ count: 0 });
          fm.setProperties({ incidence: 0 });
        });

        for (let index = 0; index < occurrences.length; index++) {
          const location = occurrences[index];

          feature = this.findFeature(location);

          if (feature !== null) {
            feature.getProperties().count = location.count;
            location.incidence = parseFloat(
              (
                (location.count / feature.getProperties().populations) *
                100000
              ).toFixed(2)
            );
            feature.getProperties().incidence = location.incidence;
            if (location.count > 0) {
              serieCount.push(location.count);
              serieIncidence.push(location.incidence);
            }
          }
          if (occurrences.length - 1 === index) {
            this.rangesCount = this.generateRangeClass(serieCount);
            this.rangesIncidence =
              this.generateRangeIncidenceClass(serieIncidence);
            this.updateFeature(occurrences);
          }
        }
      } catch (error) {
        this.$forceUpdate();
      }
    },
    closerPopover() {
      this.overlayPopup.setPosition(undefined);
      this.showPopover = false;
      this.featureSelected = {};
      return false;
    },
    loadend() {
      // observe changes in contaeiner
      new ResizeObserver(this.resize).observe(this.$refs.container);
      this.$emit('create-map', this.map);
      this.map.un('loadend', this.loadend);
    },
  },
};
</script>
<style scoped>
.map {
  width: 100%;
}
</style>
