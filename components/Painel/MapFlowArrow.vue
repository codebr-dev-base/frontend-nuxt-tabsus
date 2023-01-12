<template>
  <vl-layer-vector>
    <vl-source-vector
      ref="featuresFlowArrow"
      :features.sync="featuresFlowArrow"
    >
      <vl-style-func :factory="getStyleFlowArrow"></vl-style-func>
    </vl-source-vector>
  </vl-layer-vector>
</template>

<script>
import hexToRgba from 'hex-to-rgba';
import Vue from 'vue';
import smooth from 'chaikin-smooth';

export default {
  props: {
    dataMapFlowArrow: {
      type: Array,
      default: null,
    },
    featureDestinyFlowArrows: {
      type: Object,
      default: null,
    },
    map: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      featuresFlowArrow: [],
      styleCache: [],
      id: 316,
      colors: Vue.palette.field,
      legendControl: null,
    };
  },
  async fetch() {},
  watch: {
    dataMapFlowArrow(val) {
      if (val != null && this.featureDestinyFlowArrows != null) {
        console.log(val);
        this.setDataMap(val);
      }
    },
    map(val) {
      if (val != null) {
        // this.setControltMap();
      }
    },
  },
  created() {},
  methods: {
    setDataMap(origins) {
      this.featuresFlowArrow = [];
      const featuresFlowArrow = [];

      const coordinateDestiny = this.$olExt.findPointOnSurface(
        this.featureDestinyFlowArrows.geometry
      );
      this.arrowOrigin = [];
      for (let i = 0; i < origins.length; i++) {
        const coordinateOrigin = [
          parseFloat(origins[i].longitude),
          parseFloat(origins[i].latitude),
        ];
        featuresFlowArrow.push({
          type: 'Feature',
          id: i.toString(),
          geometry: {
            type: 'LineString',
            coordinates: [coordinateOrigin, coordinateDestiny],
          },
          name: `${origins[i].name}-${this.featureDestinyFlowArrows.properties.name}`,
          properties: {
            name: `${origins[i].name}-${this.featureDestinyFlowArrows.properties.name}`,
          },
        });
      }
      console.log(featuresFlowArrow);
      this.featuresFlowArrow = [...featuresFlowArrow];
    },
    getStyleFlowArrow() {
      return (feature) => {
        const defaultStyle = new this.$ol.Style({
          stroke: new this.$ol.Stroke({
            color: [255, 255, 255, 0.1],
            width: 2.5,
          }),
        });
        const flowStyle = new this.$olExt.FlowLine({
          color: hexToRgba('#7c1158', 0.5),
          color2: hexToRgba('#b30000', 0.5),
          width: 5,
          width2: 1,
          offset1: 15,
          arrow: 1,
          geometry: this.getGeom(feature),
          zIndex: -feature.getGeometry().getLastCoordinate()[1],
        });
        return [defaultStyle, flowStyle];
      };
    },
    getGeom(feature) {
      const l = feature.getGeometry().getCoordinates();
      const p1 = l.pop();
      const p0 = l[0];

      let dx = p1[0] - p0[0];
      let dy = p1[1] - p0[1];
      const a = Math.atan2(dy, dx);
      if (a < 0 || a > Math.PI) {
        dx = -dx;
        dy = -dy;
      }
      // const r = this.map.getView().getResolution();
      l.push([(p0[0] + p1[0]) / 2 + dy / 3, (p0[1] + p1[1]) / 2 - dx / 3]);
      /*
      l.push([
        p0[0] + (8 * (p1[0] - p0[0])) / 10,
        p1[1] +
          (p1[1] - p0[1] < -30 * r
            ? (3 * Math.abs(p1[1] - p0[1])) / 4
            : 40 * r),
      ]);
      */
      l.push(p1);

      // const ll = this.$ol.sphere.greatCircleTrack(p0, p1);
      // const median = parseInt(ll.length/80) ;
      const smoothened = this.makeSmooth(l, 5);
      const lineString = new this.$ol.geom.LineString(smoothened);
      // lineString.transform('EPSG:4326', this.map.getView().getProjection());

      return lineString;
    },
    makeSmooth(path, numIterations) {
      numIterations = Math.min(Math.max(numIterations, 1), 10);
      while (numIterations > 0) {
        path = smooth(path);
        numIterations--;
      }
      return path;
    },
  },
};
</script>
<style lang="postcss">
.ol-control.ol-legend-top {
  top: 4.5em;
  bottom: auto;
  left: 0.5em;
  z-index: 1;
  max-height: 90%;
  max-width: 90%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
