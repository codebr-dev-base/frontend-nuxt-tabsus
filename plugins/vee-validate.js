import Vue from 'vue';
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
} from 'vee-validate';
import ptBR from 'vee-validate/dist/locale/pt_BR.json';
import * as rules from 'vee-validate/dist/rules';

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Senhas não conferem!',
});

localize('pt-BR', ptBR);

// Install VeeValidate components globally
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
