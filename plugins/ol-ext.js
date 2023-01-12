import Vue from 'vue';
import { findPointOnSurface } from 'vuelayers/dist/ol-ext';
import PrintDialog from 'ol-ext/control/PrintDialog';
import Print from 'ol-ext/control/Print';
import LegendControl from 'ol-ext/control/Legend';
import Legend from 'ol-ext/legend/Legend';
import LegendItem from 'ol-ext/legend/Item';
import Chart from 'ol-ext/style/Chart';
import FlowLine from "ol-ext/style/FlowLine";
import 'ol-ext/dist/ol-ext.min.css';
// needs css-loader

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

Vue.prototype.$olExt = {
  findPointOnSurface,
  PrintDialog,
  Print,
  LegendControl,
  Legend,
  LegendItem,
  StyleChart: Chart,
  FlowLine
};
