export const state = () => ({
  theme: 'emerald',
  modeChart: 'light',
});

export const mutations = {
  changeTheme(state, theme) {
    state.theme = theme;
  },
  changeModeChart(state, mode) {
    state.modeChart = mode;
  },
};
