export default {
  data() {
    return {};
  },
  methods: {
    setFiltersLocation(params, store) {
      if (this.$store.state[store].locationType == null) {
        if (params.location_type !== undefined) {
          delete params.scope_location;
          delete params.location_type;
          delete params.location_id;
        }
      } else {
        params.scope_location = this.$store.state[store].scopeLocation;
        params.location_type = this.$store.state[store].locationType;
        params.location_id = this.$store.state[store].locationId;
      }

      this.locationName = this.$store.state[store].locationName;

      return params;
    },
    setFiltersCids(params, store, column) {
      if (params.column_filters !== undefined) {
        delete params.column_filters;
        delete params.term_filters;
      }

      if (params.column_filter_or !== undefined) {
        delete params.column_filter_or;
        delete params.term_filter_or_range;
      }

      if (this.$store.state[store].filter_cids != null) {
        params.column_filters = column;
        params.term_filters = this.$store.state[store].filter_cids;
      }

      if (this.$store.state[store].filter_groups_cids != null) {
        params.column_filter_or = [column];
        params.term_filter_or_range = this.$store.state[
          store
        ].filter_groups_cids;
      }

      if (this.$store.state[store].filter_chapters_cids != null) {
        params.column_filter_or = [column];
        params.term_filter_or_range = this.$store.state[
          store
        ].filter_chapters_cids;
      }

      return params;
    },
    resetFilters(scopeLocation) {
      this.$store.commit(`${this.module}/setScopo`, {
        scopeLocation,
      });

      this.$store.commit(`${this.module}/setLocation`, {
        locationType: null,
        locationId: null,
        locationName: this.locationName,
      });
    },
    changeLocationFilter(locationFilter) {
      this.name = locationFilter.locationName;
      this.locationName = locationFilter.locationName;

      this.$store.commit(`${this.module}/setLocationName`, {
        locationName: locationFilter.locationName,
      });
      this.setAllFilters();
    },
  },
};
