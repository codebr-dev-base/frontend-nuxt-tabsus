import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';
import RegularShape from 'ol/style/RegularShape';

import GeoJSON from 'ol/format/GeoJSON';
import hexToRgba from 'hex-to-rgba';
import Vue from 'vue';
import 'ol-ext/dist/ol-ext.min.css';

export default {
  props: {},
  data() {
    return {
      featuresChart: [],
      styleCache: [],
      id: 316,
      colors: Vue.palette.field,
      legendControlChart: null,
      sourceChart: null,
      layerChart: null,
    };
  },
  async fetch() {},
  watch: {
    dataMapCharts(val) {
      this.setDataMapChart(val);
    },
    map(val) {
      if (val != null) {
        this.createVectorChart(val);
      }
    },
    featuresChart(val) {
      if (val.length > 0) {
        this.addControltMap();
      } else {
        this.removeControltMap();
      }
    },
  },
  created() {},
  methods: {
    createVectorChart(map) {
      this.sourceChart = new VectorSource();

      this.layerChart = new VectorLayer({
        name: 'Charts',
        source: this.sourceChart,
        // y ordering
        // renderOrder: ol.ordering.yOrdering(),
        style: this.getStyleChart(),
      });

      map.addLayer(this.layerChart);
    },
    setDataMapChart(dataMaps) {
      const featuresChart = [];

      for (const dataMap of dataMaps) {
        featuresChart.push({
          type: 'Feature',
          id: Number(dataMap.munic_mov),
          geometry: {
            type: 'Point',
            coordinates: [Number(dataMap.longitude), Number(dataMap.latitude)],
          },
          name: dataMap.name,
          data: [dataMap.resident, dataMap.non_resident],
          sum: dataMap.total,
          properties: {
            name: dataMap.name,
            data: [dataMap.resident, dataMap.non_resident],
            sum: dataMap.total,
          },
        });
      }

      if (this.sourceChart !== null) {
        this.sourceChart.clear();
      }

      this.featuresChart = [...featuresChart];

      const geoJsonfeatures = {
        type: 'FeatureCollection',
        name: this.featureType,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:EPSG::4326' },
        },
        features: featuresChart,
      };

      if (this.layerChart !== null) {
        this.sourceChart.addFeatures(
          new GeoJSON().readFeatures(geoJsonfeatures)
        );
        this.layerChart.changed();
      }
    },
    getStyleChart() {
      return (feature, sel) => {

        const Chart = require('ol-ext/style/Chart').default;
        const colors = [];

        for (const color of this.colors) {
          colors.push(hexToRgba(color, 0.9));
        }
        const k = `pie-classic-${sel ? '1-' : ''}${feature.get('data')}`;

        let style = this.styleCache[k];
        if (!style) {
          let radius = 15;

          // area proportional to data size: s=PI*r^2
          // radius = 0.5 * Math.sqrt(feature.get('sum') / Math.PI);

          const data = feature.get('data');

          radius *= sel ? 1.2 : 1;

          // Create chart style
          style = [
            new Style({
              image: new Chart({
                type: 'pie3D',
                radius,
                data,
                colors,
                rotateWithView: true,
                stroke: new Stroke({
                  color: '#fff',
                  width: 2,
                }),
              }),
            }),
          ];

          // Show values on select
          if (sel) {
            const sum = feature.get('sum');

            let s = 0;
            for (let i = 0; i < data.length; i++) {
              const d = data[i];
              const a = ((2 * s + d) / sum) * Math.PI - Math.PI / 2;
              const v = Math.round((d / sum) * 1000);
              if (v > 0) {
                style.push(
                  new Style({
                    text: new Text({
                      text: v / 10 + '%' /* d.toString() */,
                      font: '12px Calibri,sans-serif',
                      offsetX: Math.cos(a) * (radius + 3),
                      offsetY: Math.sin(a) * (radius + 3),
                      textAlign: a < Math.PI / 2 ? 'left' : 'right',
                      textBaseline: 'middle',
                      stroke: new Stroke({
                        color: '#fff',
                        width: 2.5,
                      }),
                      fill: new Fill({ color: '#000' }),
                    }),
                  })
                );
              }
              s += d;
            }
          }
        }
        this.styleCache[k] = style;
        return style;
      };
    },
    addControltMap() {
      const Legend = require('ol-ext/legend/Legend').default;
      const LegendControl = require('ol-ext/control/Legend').default;

      const legend = new Legend({
        title: 'Gráfico',
        margin: 5,
      });

      if (this.legendControlChart != null) {
        this.map.removeControl(this.legendControlChart);
      }

      this.legendControlChart = new LegendControl({
        legend,
        collapsed: false,
        className: 'ol-legend ol-legend-top',
      });

      this.map.addControl(this.legendControlChart);

      legend.addItem({
        title: `Residente`,
        typeGeom: 'Point',
        style: new Style({
          image: new RegularShape({
            points: 4,
            radius: 15,
            angle: Math.PI / 4,
            stroke: new Stroke({
              color: hexToRgba('#ba68c8', 0.1),
              width: 1,
            }),
            fill: new Fill({
              color: hexToRgba(this.colors[0], 0.9),
            }),
          }),
        }),
      });

      legend.addItem({
        title: `Não Residente`,
        typeGeom: 'Point',
        style: new Style({
          image: new RegularShape({
            points: 4,
            radius: 15,
            angle: Math.PI / 4,
            stroke: new Stroke({
              color: hexToRgba('#ba68c8', 0.1),
              width: 1,
            }),
            fill: new Fill({
              color: hexToRgba(this.colors[1], 0.9),
            }),
          }),
        }),
      });
    },
    removeControltMap() {
      if (this.legendControlChart != null) {
        this.map.removeControl(this.legendControlChart);
        this.legendControlChart = null;
      }
    },
  },
};
