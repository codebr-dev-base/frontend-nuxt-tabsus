export const state = () => ({
  scopeLocation: 'codmunres',
  locationType: null,
  locationId: null,
  locationName: null,
  initial: null,
  filter_cids: null,
  filter_chapters_cids: null,
  filter_groups_cids: null,
});

export const mutations = {
  setLocation(state, payload) {
    state.locationName = payload.locationName;
    state.locationType = payload.locationType;
    state.locationId = payload.locationId;
  },
  setScopo(state, payload) {
    state.scopeLocation = payload.scopeLocation;
  },
  setLocationName(state, payload) {
    state.locationName = payload.locationName;
  },
  setInitial(state, payload) {
    state.initial = payload.initial;
  },
  setCids(state, payload) {
    state.filter_cids = payload.filter_cids;
  },
  setGroupsCids(state, payload) {
    state.filter_groups_cids = payload.filter_groups_cids;
  },
  setChaptersCids(state, payload) {
    state.filter_chapters_cids = payload.filter_chapters_cids;
  }
};
