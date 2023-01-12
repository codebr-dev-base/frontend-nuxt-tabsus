<template>
  <div class="navbar mb-2 shadow-lg bg-base-300 text-neutral rounded-box">
    <div class="px-2 mx-2 navbar-start">
      <slot name="start"></slot>
      <div
        v-for="item in locations"
        :key="item.initial"
        class="form-control btn btn-ghost btn-sm rounded-btn"
      >
      <label class="cursor-pointer label">
        <div class="avatar">
          <div class="mr-2 rounded-btn w-5 h-5">
            <img :src="item.img" />
          </div>
        </div>
        <span class="label-text">{{ item.name }}</span>

        <input
          v-model="selected"
          :value="item.initial"
          type="radio"
          class="toggle toggle-primary ml-2"
          @change="changeLocation"
        />
      </label>
      </div>
    </div>
    <div class="navbar-end">
      <slot name="end"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PainelNavbar',
  props: {
    locations: {
      type: Array,
      default() {
        return [];
      },
    },
    location: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selected: this.location,
    };
  },
  methods: {
    changeLocation() {
      this.$emit('changeLocation', this.selected);
    },
  },
};
</script>
