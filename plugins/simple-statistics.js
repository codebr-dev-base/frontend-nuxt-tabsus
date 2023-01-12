import Vue from 'vue';
import { mode, max, min, variance } from 'simple-statistics';

Vue.prototype.$ss = {
  mode,
  max,
  min,
  variance,
};
