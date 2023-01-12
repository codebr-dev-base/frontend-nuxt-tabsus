<template>
  <div class="shadow stats my-1">
    <NuxtLink :to="url">
      <div class="stat">
        <div class="stat-figure text-info">
          <div class="avatar">
            <div class="w-16 h-18 p-1 bg-base-100">
              <img :src="img" :alt="title" class="" />
            </div>
          </div>
        </div>
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-desc">{{ desc }}</div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'CardStats',
  props: {
    url: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
};
</script>
