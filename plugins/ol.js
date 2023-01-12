import Vue from 'vue';
import { Fill, Stroke, Style, Text, RegularShape } from 'ol/style';
import 'ol-ext/render/Cspline';
import { LineString, Geometry } from 'ol/geom';
import * as sphereExt from 'ol-ext/geom/sphere';
import * as sphere from 'ol/sphere';
import 'ol/ol.css';

Vue.prototype.$ol = {
  Fill,
  Stroke,
  Style,
  Text,
  RegularShape,
  geom: {
    Geometry,
    LineString
  },
  sphere: { ...sphere, ...sphereExt },
};
