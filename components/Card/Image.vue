<template>
  <div class="card text-center shadow-2xl m-2">
    <figure class="px-10 pt-10">
      <img :src="img" class="rounded-xl" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>
      <p>
        {{ desc }}
      </p>
      <div class="justify-center card-actions">
        <NuxtLink :to="url" class="btn btn-outline btn-accent">{{ button }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardImage',
  props: {
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
    button: {
        type: String,
        default: 'Mais',
    },
    url: {
      type: String,
      default: ''
    }
  },
};
</script>

