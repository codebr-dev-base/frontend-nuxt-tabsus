import themes from 'daisyui/src/colors/themes';

import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import RegularShape from 'ol/style/RegularShape';

import hexToRgba from 'hex-to-rgba';
import Vue from 'vue';
import 'ol-ext/dist/ol-ext.min.css';

export default {
  props: {
    height: {
      type: String,
      default: '80',
    },
  },
  data() {
    return {
      // map: null,
      styleList: [],
      styleText: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
          color: '#000',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
      styleBase: new Style({
        stroke: new Stroke({
          color: hexToRgba('#ba68c8', 0.1),
          width: 2,
        }),
        fill: new Fill({ color: 'rgba(255,255,255,0.5)' }),
        text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: '#000',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 3,
          }),
        }),
      }),
      colors: Vue.palette.sunSet,
      strokeBorder: new Stroke({
        color: hexToRgba('#fff', 0.5),
        width: 2,
      }),
      legendControl: null,
      rangesCount: [],
      rangesIncidence: [],
      ranges: [],
    };
  },
  computed: {
    mapStyle() {
      return {
        height: `${this.height}vh`,
      };
    },
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {},
  methods: {
    createStyle(over = false) {
      const item = this.styleList.find((item) => {
        return item.name === this.theme && item.over === over;
      });

      if (item !== undefined) {
        return item.style;
      }

      let style;

      if (over) {
        style = new Style({
          fill: new Fill({
            color: hexToRgba(themes[`[data-theme=${this.theme}]`].primary, 0.6),
          }),
          stroke: new Stroke({
            color: hexToRgba(themes[`[data-theme=${this.theme}]`].primary, 0.9),
            width: 0.3,
          }),
          text: this.styleText,
        });
      } else {
        style = new Style({
          fill: new Fill({
            color: hexToRgba(themes[`[data-theme=${this.theme}]`].primary, 0.2),
          }),
          stroke: new Stroke({
            color: hexToRgba(themes[`[data-theme=${this.theme}]`].primary, 0.9),
            width: 0.3,
          }),
          text: this.styleText,
        });
      }

      this.styleList.push({
        name: this.theme,
        over,
        style,
      });
      return style;
    },
    generateRangeClass(values) {
      // const mode = this.$ss.mode(values);
      const max = this.$ss.max(values);
      const min = this.$ss.min(values);
      // let log = Math.log10(values.length);
      const logMax = Math.log10(max);
      const logMin = Math.log10(min);
      const ranges = [];
      let log = logMax - logMin;
      if (log < 1) {
        log = log + 1;
      }

      for (let i = min; i <= max; i = Math.round(i * log, 2)) {
        ranges.push([i, Math.round(i * log, 2)]);
      }

      return ranges;
    },
    generateRangeIncidenceClass(values) {
      // let mode = this.$ss.mode(values);
      const max = this.$ss.max(values);
      const min = this.$ss.min(values);

      const log = Math.log10(values.length);

      const k = Math.round(1 + 3.3 * log);
      const ranges = [];

      for (let i = min; i <= max; i = i + Math.round(max / k)) {
        ranges.push([i, i + Math.round(max / k)]);
      }
      return ranges;
    },
    coloringMap(featureEl, location) {
      // const featureEl = this.source.getFeatureById(feature.id);

      if (featureEl != null) {
        let fill = this.fillGray;
        if (this.incidence) {
          this.ranges = [...this.rangesIncidence];

          for (let i = 0; i < this.rangesIncidence.length; i++) {
            if (
              location.incidence >= this.rangesIncidence[i][0] &&
              location.incidence <= this.rangesIncidence[i][1]
            ) {
              fill = new Fill({
                color: hexToRgba(this.colors[i], 0.7),
              });
              break;
            }
          }
        } else {
          this.ranges = [...this.rangesCount];

          for (let i = 0; i < this.rangesCount.length; i++) {
            if (
              location.count >= this.rangesCount[i][0] &&
              location.count <= this.rangesCount[i][1]
            ) {
              fill = new Fill({
                color: hexToRgba(this.colors[i], 0.7),
              });
              break;
            }
          }
        }

        featureEl.setProperties({ count: location.count });
        featureEl.setProperties({ incidence: location.incidence });

        featureEl.setStyle(
          new Style({
            stroke: new Stroke({
              color: hexToRgba('#ba68c8', 0.1),
              width: 1,
            }),
            fill,
            text: new Text({
              text: featureEl.getProperties().name,
              font: '12px Calibri,sans-serif',
              fill: new Fill({
                color: '#000',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3,
              }),
            }),
          })
        );
      } else {
        setTimeout(() => {
          this.updateFeature(featureEl, location);
        }, 1000);
      }
    },
    setPrintMap(map) {
      if (process.client) {
        const PrintDialog = require('ol-ext/control/PrintDialog').default;

        PrintDialog.prototype._labels.ptBR = {
          title: 'Imprimir',
          orientation: 'Orientação',
          portrait: 'Retrato',
          landscape: 'Paisagem',
          size: 'Tamanho da página',
          custom: 'Tamanho da tela',
          margin: 'Margem',
          scale: 'Escala',
          legend: 'Legenda',
          north: 'Seta norte',
          mapTitle: 'Título do mapa',
          saveas: 'Salvar como...',
          saveLegend: 'Salvar legenda...',
          copied: '✔ Copiado para a área de transferência',
          errorMsg: 'Não é possível salvar a tela do mapa...',
          printBt: 'Imprimir...',
          cancel: 'Cancelar',
        };
        // Print control
        const printDialog = new PrintDialog({
          lang: 'ptBR',
        });
        map.addControl(printDialog);
      }
    },
    updatedLegend(ranges, map) {
      if (process.client) {

        const Legend = require('ol-ext/legend/Legend').default;
        const LegendControl = require('ol-ext/control/Legend').default;
        if (map !== null) {
          let title = '';

          if (this.incidence) {
            title = 'Incidência';
          } else {
            title = 'Ocorrência';
          }

          const legend = new Legend({
            title,
            margin: 5,
          });

          if (this.legendControl != null) {
            map.removeControl(this.legendControl);
          }
          this.legendControl = new LegendControl({
            legend,
            collapsed: false,
          });

          map.addControl(this.legendControl);

          for (let i = 0; i < ranges.length; i++) {
            legend.addItem({
              title: `${ranges[i][0]} - ${ranges[i][1]}`,
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
                    color: hexToRgba(this.colors[i], 0.7),
                  }),
                }),
              }),
            });
          }
        } else {
          setTimeout(() => {
            this.updatedRanges(ranges, map);
          }, 2000);
        }
      }
    },
  },
};
