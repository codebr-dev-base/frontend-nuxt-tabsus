<template>
  <div>
    <vl-map
      ref="map"
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
      style="height: 80vh;"
      @pointermove="setEventMap"
    >
      <vl-view
        :zoom="zoom"
        :center.sync="center"
        :rotation.sync="rotation"
      ></vl-view>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>

      <vl-layer-vector>
        <vl-source-vector ref="mapFeatures" :features.sync="features">
        </vl-source-vector>
      </vl-layer-vector>

      <vl-layer-vector>
        <vl-source-vector ref="featureOverlay" :features.sync="featureOverlay">
        </vl-source-vector>
        <vl-style-box>
          <vl-style-stroke
            color="rgba(255,255,255,0.3)"
            :width="3"
          ></vl-style-stroke>
          <vl-style-fill color="rgba(10, 182, 255, 0.5)"></vl-style-fill>
        </vl-style-box>
      </vl-layer-vector>

      <slot name="layer-chart">

      </slot>

      <slot name="layer-flow-arrow">

      </slot>



      <!-- interactions -->
      <vl-interaction-select :features.sync="selectedFeatures" @update:features="update">
        <template slot-scope="selection">
          <!-- selected feature popup -->
          <vl-overlay
            v-for="feature in selection.features"
            :id="feature.id"
            :key="feature.id"
            class="feature-popup"
            :position="$olExt.findPointOnSurface(feature.geometry)"
            :auto-pan="true"
            :auto-pan-animation="{ duration: 300 }"
          >
            <div class="card text-center shadow-2xl bg-base-100">
              <div class="card-body">
                <h2 class="card-title">{{ feature.properties.name }}</h2>
                <p>
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

                <div class="justify-center card-actions">
                  <button
                    class="btn btn-outline btn-accent"
                    @click="
                      selectedFeatures = selectedFeatures.filter(
                        (f) => f.id !== feature.id
                      )
                    "
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </vl-overlay>
          <!--// selected popup -->
        </template>
      </vl-interaction-select>
      <!-- interactions -->

    </vl-map>
  </div>
</template>

<script>
// import { Fill, Stroke, Text } from 'ol/style';
import { kebabCase } from 'lodash';
import hexToRgba from 'hex-to-rgba';
import Vue from 'vue';

export default {
  name: 'PainelSinascMap',

  props: {
    mapFeatures: {
      type: Array,
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
      default: 6.3,
    },
  },
  data() {
    return {
      center: [-43.0691055, -6.8420932],
      rotation: 0,
      marker: require('~/assets/img/marker/marker.png'),
      features: [],
      featureOverlay: [],
      selectedFeatures: [],
      fillGray: new this.$ol.Fill({ color: 'rgba(255,255,255,0.3)' }),
      rangesCount: [],
      rangesIncidence: [],
      ranges: [],
      legendControl: null,
      colors: Vue.palette.sunSet,
    };
  },
  computed: {},
  watch: {
    mapFeatures(val) {
      this.features = [...val];
    },
    occurrences(val) {
      this.updatedOccurrences(val);
    },
    ranges(val) {
      this.updatedRanges(val);
    },
    incidence() {
      this.coloringMap(this.occurrences);
    },
  },
  created() {
    this.id = this.$route.params.id;
  },
  beforeMount() {
    if (this.features.length === 0) {
      this.features = [...this.mapFeatures];
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initControl();
        // this.initNames();
      }, 2000);
    });
  },
  activated() {},
  updated() {},
  methods: {
    initControl(count = 10) {
      this.$nextTick(() => {
        if (this.$refs.map !== undefined) {
          this.setControltMap(this.$refs.map.$map);
          this.$emit('mount', this.$refs.map.$map);
          if (this.rangesCount.length === 0) {
            this.updatedOccurrences(this.occurrences);
          }
        } else if (count > 0) {
          this.initControl(count - 1);
        }
      });
    },
    geometryTypeToCmpName(type) {
      return 'vl-geom-' + kebabCase(type);
    },
    setEventMap(evt) {
      evt.map.forEachFeatureAtPixel(evt.pixel, (f) => {
        const newFeature = this.features.find((feature) => {
          return feature.id === f.getId();
        });
        if (newFeature !== undefined) {
          this.featureOverlay = [];
          this.featureOverlay.push(newFeature);
        }
        return true;
      });
    },
    setNameMap(evt) {
      this.$refs.mapFeatures.$source.forEachFeature((feature) => {
        feature.setStyle(
          new this.$ol.Style({
            stroke: new this.$ol.Stroke({ color: '#cccccc', width: 1 }),
            fill: new this.$ol.Fill({
              color: 'rgba(217,217,217, 0.5)',
            }),
          })
        );
        feature.getStyle().setText(
          new this.$ol.Text({
            text: feature.getProperties().name,
            font: '12px Calibri,sans-serif',
            fill: new this.$ol.Fill({ color: '#000' }),
            stroke: new this.$ol.Stroke({ color: '#fff', width: 4 }),
          })
        );
      });
    },
    setControltMap(map) {
      // Print control
      const printDialog = new this.$olExt.PrintDialog({
        lang: 'ptBR',
      });
      map.addControl(printDialog);
      /*
      print.on('print', function (e) {
        const img = document.createElement('img');
        const link = document.createElement('a');
        img.src = e.image;
        link.href = img.src;
        link.download = 'mapa.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      */
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
    updatedOccurrences(occurrences) {
      let feature = null;
      const serieCount = [];
      const serieIncidence = [];

      for (const f of this.features) {
        f.properties.count = 0;
        f.properties.incidence = 0;
      }
      const fill = this.fillGray;
      this.$refs.mapFeatures.$source.forEachFeature((fm) => {
        fm.setStyle(
          new this.$ol.Style({
            stroke: new this.$ol.Stroke({
              color: hexToRgba('#ba68c8', 0.1),
              width: 1,
            }),
            fill,
          })
        );
        fm.setProperties({ count: 0 });
        fm.setProperties({ incidence: 0 });
      });

      for (let index = 0; index < occurrences.length; index++) {
        const location = occurrences[index];

        feature = this.findFeature(location);

        if (feature !== null) {
          feature.properties.count = location.count;
          location.incidence = parseFloat(
            (
              (location.count / feature.properties.populations) *
              100000
            ).toFixed(2)
          );
          feature.properties.incidence = location.incidence;
          if (location.count > 0) {
            serieCount.push(location.count);
            serieIncidence.push(location.incidence);
          }
        }
        if (occurrences.length - 1 === index) {
          this.rangesCount = this.generateRangeClass(serieCount);
          this.rangesIncidence = this.generateRangeIncidenceClass(
            serieIncidence
          );
          this.coloringMap(occurrences);
        }
      }

      /*      setTimeout(() => {
          this.rangesCount = this.generateRangeClass(serieCount);
          this.rangesIncidence = this.generateRangeIncidenceClass(
            serieIncidence
          );
          this.coloringMap(occurrences);

      }, 1000); */
    },
    coloringMap(occurrences) {
      let feature = null;

      for (const location of occurrences) {
        feature = this.findFeature(location);

        if (feature !== null) {
          this.updateFeature(feature, location);
        }
      }
    },
    updatedRanges(ranges) {
      if (this.$refs.map.$map !== undefined) {
        const map = this.$refs.map.$map;

        let title = '';

        if (this.incidence) {
          title = 'Incidência';
        } else {
          title = 'Ocorrência';
        }

        const legend = new this.$olExt.Legend({
          title,
          margin: 5,
        });

        if (this.legendControl != null) {
          map.removeControl(this.legendControl);
        }
        this.legendControl = new this.$olExt.LegendControl({
          legend,
          collapsed: false,
        });

        map.addControl(this.legendControl);

        for (let i = 0; i < ranges.length; i++) {
          legend.addItem({
            title: `${ranges[i][0]} - ${ranges[i][1]}`,
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
                  color: hexToRgba(this.colors[i], 0.7),
                }),
              }),
            }),
          });
        }
      } else {
        setTimeout(() => {
          this.updatedRanges(ranges);
        }, 2000);
      }
    },
    updateFeature(feature, location) {
      const featureEl = this.$refs.mapFeatures.$source.getFeatureById(
        feature.id
      );

      if (featureEl != null) {
        let fill = this.fillGray;
        if (this.incidence) {
          this.ranges = [...this.rangesIncidence];

          for (let i = 0; i < this.rangesIncidence.length; i++) {
            if (
              location.incidence >= this.rangesIncidence[i][0] &&
              location.incidence <= this.rangesIncidence[i][1]
            ) {
              fill = new this.$ol.Fill({
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
              fill = new this.$ol.Fill({
                color: hexToRgba(this.colors[i], 0.7),
              });
              break;
            }
          }
        }

        featureEl.setProperties({ count: location.count });
        featureEl.setProperties({ incidence: location.incidence });

        featureEl.setStyle(
          new this.$ol.Style({
            stroke: new this.$ol.Stroke({
              color: hexToRgba('#ba68c8', 0.1),
              width: 1,
            }),
            fill,
            text: new this.$ol.Text({
              text: feature.properties.name,
              font: '12px Calibri,sans-serif',
              fill: new this.$ol.Fill({ color: '#000' }),
              stroke: new this.$ol.Stroke({ color: '#fff', width: 4 }),
            }),
          })
        );
      } else {
        setTimeout(() => {
          this.updateFeature(feature, location);
        }, 1000);
      }
    },

    findFeature(occurrence) {
      let feature = null;

      for (const f of this.features) {
        if (occurrence.ibge_id.toString().length === 6) {
          if (f.properties.ibge_id_short === occurrence.ibge_id) {
            feature = f;
            break;
          }
        } else if (f.properties.ibge_id === occurrence.ibge_id) {
          feature = f;
          break;
        }
      }
      return feature;
    },
    update(features) {
      if (features.length > 0) {
        this.$emit('select', features[0]);
      } else {
        this.$emit('select', null);
      }
      /*
      for (const feature of features) {
        this.$emit('select', feature);
      }
       */
    }
  },
};
</script>
