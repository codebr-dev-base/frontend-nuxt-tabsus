import Vue from 'vue';
import moment from 'moment';

Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY');
  }
});
Vue.filter('formatDateTime', (value) => {
  if (value) {
    return moment(value).format('DD/MM/YYYY HH:mm');
  }
});
Vue.filter('truncate', (value, limit) => {
  if (value.length > limit) {
    value = value.substring(0, limit - 3) + '...';
  }
  return value;
});
Vue.filter('strippedHtml', (value) => {
  const regex = /(<([^>]+)>)/gi;
  return value.replace(regex, '');
});
Vue.filter('locateNumber', (value) => {
  if (!value) {
    return '';
  } else {
    if(typeof value === 'string') {
      value = Number(value);
    }
    return value.toLocaleString('pt-BR');
  }
});
Vue.filter('locateCurrency', (value) => {
  if (!value) {
    return '';
  } else {
    if(typeof value === 'string') {
      value = Number(value);
    }
    return value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }
});
