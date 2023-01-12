<template>
  <div class="layout" :data-theme="theme">
    <div class="sidebar" :class="{ 'sidebar-show': sidebarShow }">
      <ul class="menu-sidebar menu">
        <li class="menu-title my-2 p-0">
          <a>
            <div class="logo-avatar">
              <div class="mb-1 w-20 h-20 mask mask-squircle">
                <img class="inline" :src="logo_mini" alt="CodeBr.dev" />
              </div>
            </div>
            <div class="logo">
              <div class="mb-1 w-48">
                <img class="inline rounded-lg" :src="logo" alt="CodeBr.dev" />
              </div>
            </div>
          </a>
        </li>
        <li>
          <NuxtLink to="/" class="btn btn-ghost">
            <fa-icon icon="house" class="icon-menu" />
            <span> Home </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/panels/sinasc" class="btn btn-ghost">
            <fa-icon icon="chart-pie" class="icon-menu" />
            <span> SINASC </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/panels/sim" class="btn btn-ghost">
            <fa-icon icon="chart-pie" class="icon-menu" />
            <span> SIM </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/panels/sih" class="btn btn-ghost">
            <fa-icon icon="chart-pie" class="icon-menu" />
            <span> SIH </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/datasets" class="btn btn-ghost">
            <fa-icon icon="database" class="icon-menu" />
            <span> Datasets </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="top-menu">
        <div class="title">
          <h2 class="ml-2 p-2">Dashboard</h2>
        </div>
        <client-only>
          <ul class="menu items-stretch horizontal">
            <li class="hidden md:inline">
              <span>🎨 Temas:</span>
            </li>
            <li class="hidden md:inline mr-1 md:mr-3">
              <select v-model="selectedTheme" class="select-theme">
                <option disabled="disabled" selected="selected">
                  <span>🎨</span>
                  <span class="hidden md:inline">Tema</span>
                </option>
                <option
                  v-for="(item, index) in themes"
                  :key="index"
                  :value="item"
                >
                  <span>{{ themeIcon[index] }}</span>
                  <span class="hidden md:inline">{{ item }}</span>
                </option>
              </select>
            </li>
            <li class="md:hidden mr-1 md:mr-3">
              <select v-model="selectedTheme" class="select-theme">
                <option disabled="disabled" selected="selected">
                  <span>🎨</span>
                </option>
                <option
                  v-for="(item, index) in themes"
                  :key="index"
                  :value="item"
                >
                  <span>{{ themeIcon[index] }}</span>
                </option>
              </select>
            </li>
            <li v-if="loggedIn">
              <a class="rounded-lg" @click="logout">
                <span class="mr-1">Logout</span>
                <fa-icon icon="sign-out-alt" />
              </a>
            </li>
            <li v-if="!loggedIn">
              <NuxtLink to="/login" class="rounded-lg">
                <span class="mr-1">Login</span>
                <fa-icon icon="right-to-bracket" />
              </NuxtLink>
            </li>
            <li class="lg:hidden">
              <a class="rounded-lg" @click="sidebarShow = !sidebarShow">
                <fa-icon icon="bars" />
              </a>
            </li>
          </ul>
        </client-only>
      </div>
      <div class="content-main">
        <Nuxt />
      </div>
      <div class="footer p-2">
        <div class="items-center grid-flow-col">
          <fa-icon :icon="['fab', 'slack']" class="fa-3x" />
          <p>Copyright © 2022 - All right reserved</p>
        </div>
        <div
          class="grid-flow-col gap-4 md:place-self-center md:justify-self-end"
        >
          <a>
            <fa-icon :icon="['fab', 'youtube']" class="fa-2x" />
          </a>
          <a>
            <fa-icon :icon="['fab', 'facebook']" class="fa-2x" />
          </a>
          <a>
            <fa-icon :icon="['fab', 'twitter']" class="fa-2x" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/component-definition-name-casing
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Default',
  data() {
    return {
      logo_light: require('~/assets/img/logo_tabnet_light.png'),
      logo_dark: require('~/assets/img/logo_tabnet_dark.png'),
      logo_mini_light: require('~/assets/img/logo_mini_transparent_light.png'),
      logo_mini_dark: require('~/assets/img/logo_mini_transparent_dark.png'),
      sidebarShow: false,
      selectedTheme: 'emerald',
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
      themeIcon: [
        '🟢',
        '💡',
        '🧁',
        '🐝',
        '💌',
        '🌷',
        '📰',
        '📘',
        '🎆',
        '🪨',
        '🫐',
        '🕶️',
        '🐈‍⬛',
        '🎃',
        '🌳',
        '🌊',
        '🍑',
        '🧛',
      ],
      themeDark: [
        'dark',
        'synthwave',
        'halloween',
        'forest',
        'aqua',
        'luxury',
        'dracula',
      ],
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    logo() {
      if (this.themeLight.includes(this.selectedTheme)) {
        return this.logo_light;
      }
      return this.logo_dark;
    },
    logo_mini() {
      if (this.themeLight.includes(this.selectedTheme)) {
        return this.logo_mini_light;
      }
      return this.logo_mini_dark;
    },
    themes() {
      return [...this.themeLight, ...this.themeDark];
    },
  },
  watch: {
    selectedTheme(theme) {
      this.$store.commit('changeTheme', this.selectedTheme);
      if (this.themeLight.includes(this.selectedTheme)) {
        this.$store.commit('changeModeChart', 'light');
      } else {
        this.$store.commit('changeModeChart', 'dark');
      }
    },
  },
  mounted() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      this.$nextTick(function () {
        window.addEventListener('resize', this.getWindowWidth);
      });
    }
  },
  methods: {
    getWindowWidth(event) {
      // console.log(event.target.innerWidth)
      const width = document.documentElement.clientWidth;
      if (width >= 1024) {
        this.sidebarShow = false;
      }
    },
    async logout() {
      await this.$auth.logout();
      this.$router.push('/');
    },
  },
};
</script>
<style lang="postcss" scoped>
.layout {
  @apply flex bg-base-300 text-base-content min-h-max w-screen max-w-full h-screen;
}

.sidebar {
  @apply m-2 min-h-max flex-none w-0 bg-base-100 duration-1000 ease-in-out;
  @apply md:w-24 md:m-2 lg:w-56 shadow-lg rounded-lg;
  @apply border-r-2 border-r-primary;
}

.sidebar > .menu {
  @apply hidden md:flex;
}

.sidebar > ul {
  @apply m-2 pl-0;
}

.logo-avatar {
  @apply avatar placeholder lg:hidden;
}

.logo {
  @apply hidden lg:inline;
}

.sidebar > ul > li > a {
  @apply m-0 p-1 ml-1 md:mx-auto md:justify-center lg:ml-0 w-full lg:justify-start;
}

.sidebar > ul > li > a > span {
  @apply ml-2 pl-2 hidden lg:inline-flex;
}

.sidebar > ul > li > a > .icon-menu {
  @apply md:text-3xl ml-2;
}

.sidebar-show {
  position: absolute;
  height: 97.5vh;
  top: 0.3%;
  z-index: 1;
  @apply w-72;
}

.sidebar-show > .menu {
  @apply flex;
}

.sidebar-show > .menu > li > a > .logo {
  @apply flex;
}

.sidebar-show > .menu > li > a > .logo-avatar {
  @apply hidden;
}

.sidebar-show > ul > li > a > span {
  @apply inline-flex;
}

.sidebar-show > ul > li > a {
  @apply m-0 justify-start;
}

.nuxt-link-exact-active {
  @apply active;
}

.content {
  @apply min-h-max flex-auto flex flex-col;
}

.top-menu {
  @apply flex justify-between items-center;
  @apply bg-base-100 shadow-lg m-2 rounded-lg;
  @apply border-b-2 border-b-primary;
}

.top-menu > .title > h2 {
  margin-top: 0;
  margin-bottom: 0;
}

.top-menu > .menu {
  @apply pr-2 flex-none flex flex-row;
}

.top-menu > .menu > div {
  @apply pr-2;
}

.content-main {
  @apply grow bg-base-100 shadow-lg m-2 rounded-lg p-2 overflow-y-auto;
}

.footer {
  @apply bg-base-100 shadow-lg m-2 w-auto rounded-lg;
  @apply border-t-2 border-t-primary;
}

.select-theme {
  padding: 0;
  @apply select select-bordered select-sm select-primary w-full m-1 md:m-2;
}
</style>
