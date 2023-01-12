<template>
  <div class="content-main">
    <div
      class="m-0 mb-1 w-full md:h-full md:w-1/2 grid grid-cols-1 justify-items-center content-center"
    >
      <div class="card-login text-neutral">
        <img class="hidden md:inline rounded-lg" :src="logo" alt="logo" />
        <h2 class="card-title">Bem Vindo!</h2>
        <p>Para prosseguir preciso de sua credenciais</p>
      </div>
    </div>
    <div
      class="m-0 w-full md:h-full md:w-1/2 grid grid-cols-1 justify-items-center content-start md:content-center overflow-auto"
    >
      <LazyCardFlash :is-toggle.sync="isFlip" class="card-login">
        <template slot="front">
          <div class="flex flex-col w-full h-full rounded-lg p-2 bg-white/75">
            <ValidationObserver v-slot="{ invalid }">
              <form @submit.prevent="onSubmit">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="E-mail"
                  rules="required|email"
                >
                  <div class="form-control">
                    <label class="input-group">
                      <span class="w-28">E-mail:</span>
                      <input
                        v-model="login.email"
                        type="email"
                        name="email"
                        placeholder="info@codebe.dev"
                        class="input input-error input-bordered w-full"
                      />
                    </label>
                    <label class="label">
                      <span class="label-text-alt text-error">
                        {{ errors[0] }}
                      </span>
                    </label>
                  </div>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <div class="form-control">
                    <label class="input-group">
                      <span class="w-24">Password:</span>
                      <input
                        v-model="login.password"
                        type="password"
                        placeholder="password"
                        class="input input-error input-bordered w-full"
                      />
                    </label>
                    <label class="label">
                      <span class="label-text-alt text-error">
                        {{ errors[0] }}
                      </span>
                    </label>
                  </div>
                </ValidationProvider>

                <div class="justify-center card-actions">
                  <button
                    type="submit"
                    :disabled="invalid"
                    class="btn btn-wide btn-primary"
                  >
                    Login
                  </button>

                  <div class="divider w-full">OU</div>

                  <a class="btn btn-info btn-wide" :href="loginGoogle">
                    <fa-icon :icon="['fab', 'google']" class="fa-1x mr-2" />
                    <span>Google</span>
                  </a>
                  <a class="btn btn-wide btn-primary" @click="isFlip = !isFlip">
                    Register
                  </a>
                </div>
              </form>
            </ValidationObserver>
          </div>
        </template>
        <template slot="footer-front"> </template>
        <template slot="back">
          <div class="flex flex-col w-full h-full rounded-lg p-2 bg-white/75">
            <ValidationObserver v-slot="{ invalid }">
              <form @submit.prevent="onSubmitRegister">
                <div class="justify-center card-actions">
                  <div v-show="showAvatar" class="avatar">
                    <div class="mb-8 rounded-btn w-48 h-48">
                      <img :src="logo_mini" />
                    </div>
                    <a
                      class="btn btn-outline btn-sm w-48"
                      @click="toggleShowAvatar"
                      >Selecionar imagem</a
                    >
                  </div>
                  <div v-show="!showAvatar" class="avatar">
                    <div class="mb-8 rounded-btn p-2">
                      <croppa
                        v-model="avatarCrop"
                        :width="200"
                        :height="200"
                        :placeholder-font-size="18"
                        placeholder="Escolher sua imagem"
                      >
                      </croppa>
                    </div>
                  </div>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Nome"
                    rules="required|min:3"
                  >
                    <div class="form-control">
                      <label class="input-group input-group-sm">
                        <span class="w-28">Nome:</span>
                        <input
                          v-model="newUser.name"
                          type="text"
                          name="name"
                          placeholder="Nome:"
                          class="input input-error input-bordered input-sm w-full"
                        />
                      </label>
                      <label class="label">
                        <span class="label-text-alt text-error">
                          {{ errors[0] }}
                        </span>
                      </label>
                    </div>
                  </ValidationProvider>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="E-mail"
                    rules="required|email"
                  >
                    <div class="form-control">
                      <label class="input-group input-group-sm">
                        <span class="w-28">E-mail:</span>
                        <input
                          v-model="newUser.email"
                          type="email"
                          name="email"
                          placeholder="info@codebe.dev"
                          class="input input-error input-bordered input-sm w-full"
                        />
                      </label>
                      <label class="label">
                        <span class="label-text-alt text-error">
                          {{ errors[0] }}
                        </span>
                      </label>
                    </div>
                  </ValidationProvider>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Telefone"
                    rules="required|min:3"
                  >
                    <div class="form-control">
                      <label class="input-group input-group-sm">
                        <span class="w-28">Telefone:</span>
                        <input
                          v-model="newUser.phone"
                          v-mask="mask.phone"
                          type="text"
                          name="name"
                          placeholder="Telefone"
                          class="input input-error input-bordered input-sm w-full"
                        />
                      </label>
                      <label class="label">
                        <span class="label-text-alt text-error">
                          {{ errors[0] }}
                        </span>
                      </label>
                    </div>
                  </ValidationProvider>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Password"
                    :rules="{
                      regex:
                        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
                      required: true,
                    }"
                  >
                    <div class="form-control my-1">
                      <label class="input-group input-group-sm">
                        <span class="w-24">Password:</span>
                        <input
                          v-model="newUser.password"
                          type="password"
                          placeholder="password"
                          class="input input-error input-bordered input-sm w-full"
                        />
                      </label>
                      <label class="label">
                        <span class="label-text-alt text-error">
                          {{ errors[0] }} a senha deve ter no mínimo 8
                          caracteres 1 minúscula 1 maiúscula 1 número e 1
                          caracter especial
                        </span>
                      </label>
                    </div>
                  </ValidationProvider>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Confirme a Password"
                    rules="required|password:@Password"
                  >
                    <div class="form-control">
                      <label class="input-group input-group-sm">
                        <span class="w-24">Password:</span>
                        <input
                          v-model="newUser.password_confirmation"
                          type="password"
                          placeholder="confirme password"
                          class="input input-error input-bordered input-sm w-full"
                        />
                      </label>
                      <label class="label">
                        <span class="label-text-alt text-error">
                          {{ errors[0] }}
                        </span>
                      </label>
                    </div>
                  </ValidationProvider>

                  <button
                    type="submit"
                    :disabled="invalid"
                    class="btn btn-wide btn-primary"
                  >
                    Cadastrar
                  </button>
                  <a class="btn btn-wide btn-primary" @click="isFlip = !isFlip">
                    Login
                  </a>
                </div>
              </form>
            </ValidationObserver>
          </div>
        </template>
        <template slot="footer-back"> </template>
      </LazyCardFlash>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  components: {},
  layout: 'generic',

  data() {
    return {
      avatarCrop: {},
      showAvatar: true,
      isFlip: false,
      avatar: false,
      logo: require('~/assets/img/logo_claro_width.png'),
      logo_mini: require('~/assets/img/logo_escuro_mini.png'),
      loginGoogle: `${process.env.API_BASE_URL}/api/google/redirect`,
      login: {
        email: null,
        password: null,
      },
      newUser: {
        name: null,
        email: null,
        phone: null,
        password: null,
        password_confirmation: null,
      },
      mask: {
        phone: '(##) #####-####',
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    isSuperuser() {
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  beforeMount() {},
  mounted() {},
  methods: {
    async onSubmit() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            email: this.login.email,
            password: this.login.password,
          },
        });
        this.$toast.success('Login efetuado!');
        this.$auth.strategy.token.set(response.data.access_token);
        this.$auth.setUser(response.data.user);

        this.$router.push('/');
      } catch (error) {
        const erros = error.response.data.data;

        for (const prop in erros) {
          erros[prop].forEach((element) => {
            this.$toast.error(element);
          });
        }
      }
    },
    toggleShowAvatar() {
      this.showAvatar = !this.showAvatar;

      if (!this.showAvatar) {
        this.avatarCrop.chooseFile();
      }
    },
    async onSubmitRegister() {
      await this.avatarCrop.generateBlob(async (blob) => {
        const form = new FormData();

        form.append('name', this.newUser.name);
        form.append('email', this.newUser.email);
        form.append('phone', this.newUser.phone);
        form.append('password', this.newUser.password);
        form.append(
          'password_confirmation',
          this.newUser.password_confirmation
        );

        if (this.avatarCrop.hasImage()) {
          form.append('avatar', blob, 'avatar.jpg');
        }

        const response = await this.$axios.post(`register/`, form);
        const user = response.data.user;
        const accessToken = response.data.access_token;
        this.$auth.strategy.token.set(accessToken);
        this.$auth.setUser(user);
        this.$router.push('/');
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.content-main {
  height: 90%;
  @apply bg-base-200 shadow-lg m-2 rounded-lg p-2 flex flex-wrap;
}

.card-login {
  @apply bg-base-200 rounded-lg shadow-lg w-full md:w-96 p-4;
  @apply bg-gradient-to-tr from-blue-300 via-emerald-300 to-yellow-300;
}

.divider::after,
.divider::before {
  @apply bg-primary;
}

.avatar > a {
  position: absolute;
  bottom: 32px;
}
</style>
