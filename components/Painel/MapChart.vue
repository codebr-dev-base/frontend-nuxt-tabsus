<template>
  <vl-layer-vector>
    <vl-source-vector ref="featuresChart" :features.sync="featuresChart">
      <vl-style-func :factory="getStyleChart"></vl-style-func>
    </vl-source-vector>
  </vl-layer-vector>
</template>

<script>
import hexToRgba from 'hex-to-rgba';
import Vue from 'vue';

export default {
  props: {
    dataMapCharts: {
      type: Array,
      default: () => {
        return [];
      },
    },
    map: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      featuresChart: [],
      styleCache: [],
      id: 316,
      colors: Vue.palette.field,
      legendControl: null,
    };
  },
  async fetch() {},
  watch: {
    dataMapCharts(val) {
      this.setDataMap(val);
    },
    map(val) {
      if (val != null) {
        // this.setControltMap();
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
    setDataMap(dataMaps) {
      this.featuresChart = [];
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

      this.featuresChart = [...featuresChart];
    },
    getStyleChart() {
      return (feature, sel) => {
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
            new this.$ol.Style({
              image: new this.$olExt.StyleChart({
                type: 'pie3D',
                radius,
                data,
                colors,
                rotateWithView: true,
                stroke: new this.$ol.Stroke({
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
                  new this.$ol.Style({
                    text: new this.$ol.Text({
                      text: v / 10 + '%' /* d.toString() */,
                      font: '12px Calibri,sans-serif',
                      offsetX: Math.cos(a) * (radius + 3),
                      offsetY: Math.sin(a) * (radius + 3),
                      textAlign: a < Math.PI / 2 ? 'left' : 'right',
                      textBaseline: 'middle',
                      stroke: new this.$ol.Stroke({
                        color: '#fff',
                        width: 2.5,
                      }),
                      fill: new this.$ol.Fill({ color: '#000' }),
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
      const legend = new this.$olExt.Legend({
        title: 'Gráfico',
        margin: 5,
      });

      if (this.legendControl != null) {
        this.map.removeControl(this.legendControl);
      }

      this.legendControl = new this.$olExt.LegendControl({
        legend,
        collapsed: false,
        className: 'ol-legend ol-legend-top',
      });

      this.map.addControl(this.legendControl);

      legend.addItem({
        title: `Residente`,
        typeGeom: 'Point',
        style: new this.$ol.Style({
          image: new this.$ol.RegularShape({
            points: 4,
            radius: 15,
            angle: Math.PI / 4,
            stroke: new this.$ol.Stroke({
              color: hexToRgba('#ba68c8', 0.1),
              width: 1,
            }),
            fill: new this.$ol.Fill({
              color: hexToRgba(this.colors[0], 0.9),
            }),
          }),
        }),
      });

      legend.addItem({
        title: `Não Residente`,
        typeGeom: 'Point',
        style: new this.$ol.Style({
          image: new this.$ol.RegularShape({
            points: 4,
            radius: 15,
            angle: Math.PI / 4,
            stroke: new this.$ol.Stroke({
              color: hexToRgba('#ba68c8', 0.1),
              width: 1,
            }),
            fill: new this.$ol.Fill({
              color: hexToRgba(this.colors[1], 0.9),
            }),
          }),
        }),
      });
    },
    removeControltMap() {
      if (this.legendControl != null) {
        this.map.removeControl(this.legendControl);
        this.legendControl = null;
      }
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
