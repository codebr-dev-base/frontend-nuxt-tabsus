export default {
  globalName: 'CodeBR.dev',
  env: {
    apiUrl: process.env.API_BASE_URL,
    baseUrl: process.env.BASE_URL,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'TabSUS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },

      { name: 'msapplication-TileColor', content: '#333333' },
      { name: 'theme-color', content: '#333333' },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#333333' },
    ],
    bodyAttrs: {
      'data-theme': 'emerald',
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/tailwind.css',
    'vue-croppa/dist/vue-croppa.css',
    'ol/ol.css',
    'ol-ext/dist/ol-ext.min.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/vue-croppa' },
    { src: '~/plugins/v-mask' },
    { src: '~plugins/filter' },
    { src: '~/plugins/apexcharts', mode: 'client' },
    { src: '~/plugins/v-click-outside', mode: 'client' },
    { src: '~/plugins/vuelayers', mode: 'client' },
    // { src: '~/plugins/ol-ext', mode: 'client' },
    // { src: '~/plugins/ol', mode: 'client' },
    { src: '~/plugins/locale' },
    { src: '~/plugins/palette' },
    { src: '~/plugins/simple-statistics' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://tailwindcss.nuxtjs.org
    '@nuxtjs/tailwindcss',
    // https://github.com/nuxt/postcss8
    '@nuxt/postcss8',
    // https://github.com/nuxt-community/fontawesome-module
    ['@nuxtjs/fontawesome', { component: 'fa', suffix: true }],
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // https://github.com/nuxt-community/moment-module
    [
      '@nuxtjs/moment',
      {
        defaultLocale: 'pt-br',
        locales: ['pt-br'],
        defaultTimezone: 'America/Fortaleza',
      },
    ],
    // https://github.com/cipami/nuxt-lodash#readme
    'nuxt-lodash',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://dev.auth.nuxtjs.org/guide/setup
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/Maronato/vue-toastification/tree/main
    [
      'vue-toastification/nuxt',
      {
        timeout: 3000,
      },
    ],
    'vue-swatches/nuxt',
  ],
  // Config router
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'datasets-loads',
        path: '/datasets/load/:source/:system/:initial',
        component: '~/pages/datasets/_load.vue',
      });
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: `${process.env.API_BASE_URL}/api/`,
    // proxy: true,
    credentials: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'pt-br',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
    },
    transpile: [
      'vee-validate/dist/rules',
      'hex-to-rgba',
      'vuelayers',
      'simple-statistics',
      'ol/',
      'ol/format',
      'ol/geom',
      'ol/layer',
      'ol/source',
      'ol/style',
      'ol-ext/control/',
      'ol-ext/legend/',
      'ol-ext/style/',
    ],
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
        'postcss-url': false,
        'postcss-import': true,
        'postcss-nested': {},
        'postcss-responsive-type': {},
        'postcss-hexrgba': {},
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true,
        },
      },
    },
  },

  // configuration tailwindcss
  tailwindcss: {
    configPath: 'tailwind.config.js',
    exposeConfig: true,
    config: {},
    injectPosition: 0,
  },
  fontawesome: {
    icons: {
      solid: [
        'faHouse',
        'faSpinner',
        'faCoffee',
        'faEdit',
        'faCircle',
        'faArrowCircleRight',
        'faBars',
        'faRightToBracket',
        'faSignInAlt',
        'faEllipsisH',
        'faDatabase',
        'faMagnifyingGlass',
        'faChartPie',
        'faFilter',
        'faTimes',
        'faChevronRight',
        'faSquarePlus'
      ],
      regular: [
        'faEye',
        'faTimesCircle',
        'faTrashAlt',
        'faMap'
      ],
      light: [],
      duotone: [],
      brands: [
        'faSlack',
        'faTwitter',
        'faYoutube',
        'faFacebook',
        'faGoogle',
      ],
    },
  },
  nuxtValidate: {
    lang: 'pt_BR',
  },

  auth: {
    cookie: false,
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          type: 'Bearer',
          property: 'plainTextToken',
          global: true,
          required: true,
          maxAge: 60 * 24 * 6,
        },
        refreshToken: {
          property: 'access_token',
          data: 'access_token',
          maxAge: 60 * 24 * 7,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/v1/login/', method: 'post' },
          logout: { url: '/v1/logout/', method: 'post' },
          refresh: { url: '/v1/refresh/', method: 'post' },
          user: { url: '/v1/me/', method: 'post' },
        },
      },
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: `${process.env.API_BASE_URL}/api`,
        token: {
          type: 'Bearer',
          property: 'plainTextToken',
          global: true,
          required: true,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/v1/login/', method: 'post' },
          logout: { url: '/v1/logout/', method: 'post' },
          refresh: { url: '/v1/refresh/', method: 'post' },
          user: { url: '/v1/me/', method: 'post' },
        },
      },
    },
  },
};
