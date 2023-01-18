import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

import LineString from 'ol/geom/LineString';
import { getCenter } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';

import hexToRgba from 'hex-to-rgba';
import Vue from 'vue';
import smooth from 'chaikin-smooth';

export default {
  props: {},
  data() {
    return {
      featuresFlowArrow: [],
      styleCache: [],
      id: 316,
      colors: Vue.palette.field,
      legendControl: null,
      sourceArrow: null,
      layerArrow: null,
    };
  },
  async fetch() {},
  watch: {
    map(val) {
      if (val != null) {
        this.createVectorArrow(val);
      }
    },
    dataMapFlowArrows(val) {
      if (val != null && this.featureDestinyFlowArrow != null) {
        this.setDataMapArrow(val);
      }
    },
  },
  created() {},
  methods: {
    createVectorArrow(map) {
      this.sourceArrow = new VectorSource();

      this.layerArrow = new VectorLayer({
        name: 'Arrows',
        source: this.sourceArrow,
        // y ordering
        // renderOrder: ol.ordering.yOrdering(),
        style: this.getStyleFlowArrow(),
      });

      map.addLayer(this.layerArrow);
    },
    setDataMapArrow(origins) {
      this.featuresFlowArrow = [];
      const featuresFlowArrow = [];

      const coordinates = this.featureDestinyFlowArrow
        .getGeometry()
        .getExtent();
      const coordinateDestiny = getCenter(coordinates);

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
          name: `${origins[i].name}-${
            this.featureDestinyFlowArrow.getProperties().name
          }`,
          properties: {
            name: `${origins[i].name}-${
              this.featureDestinyFlowArrow.getProperties().name
            } - ${origins[i].count}`,
            count: origins[i].count,
          },
        });
      }

      if (this.sourceArrow !== null) {
        this.sourceArrow.clear();
      }

      this.featuresFlowArrow = [...featuresFlowArrow];

      const geoJsonfeatures = {
        type: 'FeatureCollection',
        name: this.featureType,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:EPSG::4326' },
        },
        features: featuresFlowArrow,
      };

      if (this.layerArrow !== null) {
        this.sourceArrow.addFeatures(
          new GeoJSON().readFeatures(geoJsonfeatures)
        );
        this.layerArrow.changed();
      }
    },
    getStyleFlowArrow() {
      return (feature) => {
        const FlowLine = require('ol-ext/style/FlowLine').default;

        const defaultStyle = new Style({
          stroke: new Stroke({
            color: [255, 255, 255, 0.1],
            width: 2.5,
          }),
        });
        const flowStyle = new FlowLine({
          color: hexToRgba(this.colors[Math.floor(Math.random() * 8) + 1], 0.8 + (feature.getProperties().count * 0.0005)),
          color2: hexToRgba(this.colors[Math.floor(Math.random() * 8) + 1], 0.8 + (feature.getProperties().count * 0.002)),
          width: 0.8 + (feature.getProperties().count * 0.05),
          width2: 0.5,
          offset1: 25,
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

      // const ll = greatCircleTrack(p0, p1);
      // const median = parseInt(ll.length/80) ;
      const smoothened = this.makeSmooth(l, 5);
      const lineString = new LineString(smoothened);
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
