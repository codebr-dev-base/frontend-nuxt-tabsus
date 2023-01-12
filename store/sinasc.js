export const state = () => ({
  scopeLocation: 'codmunres',
  locationType: null,
  locationId: null,
  locationName: null,
  initial: null,
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
};
