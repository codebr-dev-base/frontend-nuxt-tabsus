<template>
  <div class="flex justify-center w-full">
    <div class="card w-4/5 md:w-3/4 bg-base-100 shadow-xl mt-6">
      <figure>
        <img :src="logo" alt="Shoes" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">Bem Vindo!</h2>
        <p>
          O TABSUS é um sistema voltada para análise de dados dos diversos
          sistemas do SUS, este portfólio foi inteiramente construído com os
          dados abertos do SUS, observando as regras da LGPD, nesta primeira
          versão, traz um conjunto de dados do SIM e SINASC do Maranhão e Piauí
          do período de 2001 a 2020.
        </p>
        <p>
          O objetivo do sistema é fornecer ao gestor, técnico, pesquisador ou
          estudante, um ambiente integrador para consulta, visualização de
          mapas, extração de dados.
        </p>
        <div
          class="relative h-0 overflow-hidden max-w-full w-full mx-2"
          style="padding-bottom: 56.25%;"
        >
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/dxENPXz1GzQ"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div
          class="relative h-0 overflow-hidden max-w-full w-full mx-2"
          style="padding-bottom: 56.25%;"
        >
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/wFiHqkmFPME"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div
          class="relative h-0 overflow-hidden max-w-full w-full mx-2"
          style="padding-bottom: 56.25%;"
        >
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/iq14EUCTsoU"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  name: 'IndexPage',
  data() {
    return {
      sidebarShow: false,
      logo_light: require('~/assets/img/logo_tabnet_light.png'),
      logo_dark: require('~/assets/img/logo_tabnet_dark.png'),
      themeLight: [
        'emerald',
        'light',
        'cupcake',
        'bumblebee',
        'valentine',
        'garden',
        'lofi',
        'pastel',
        'fantasy',
        'wireframe',
        'cmyk',
      ],
    };
  },
  computed: {
    logo() {
      if (this.themeLight.includes(this.$store.state.theme)) {
        return this.logo_light;
      }
      return this.logo_dark;
    },
  },
  mounted() {},
};
</script>
