<template>
  <!-- Use <b-container-fluid> for a full width container-->
  <b-container class="my-row">
    <ModalAbout
      modalId="modal-about"
      :modalTitle="$t('about.title')"
      headerBgVariant="primary"
      footerBgVariant="primary"
    ></ModalAbout>

    <b-row class="my-4">
      <b-col cols="10" offset="1">
        <router-link v-b-modal="'modal-about'" to="/about">
          <img
            :alt="$t('logo.alt')"
            :title="$t('logo.title')"
            src="../assets/logo.png"
          />
        </router-link>
      </b-col>
      <b-col>
        <!-- Locale changer in a separate component - configure language flag + name -->
        <b-navbar-nav class="ml-auto">
          <LocaleChanger
            :dropdown="false"
            :flag="true"
            :name="true"
            :flagHeight="32"
          />
        </b-navbar-nav>
      </b-col>
    </b-row>

    <b-row class="my-4">
      <b-col cols="10" offset="1">
        <h2>{{ $t("login.title") }}</h2>

        <ValidationObserver ref="observer" v-slot="{ passes }">
          <b-form @submit.prevent="passes(onSubmit)" @reset="resetForm">
            <ValidationProvider
              rules="required|email"
              name="f_username"
              v-slot="{ valid, errors }"
            >
              <b-form-group
                id="gr-username"
                label-cols="4"
                :label="$t('fields.f_username')"
                label-for="input-1"
                :description="$t('fields.d_username')"
              >
                <b-form-input
                  id="input-1"
                  type="email"
                  trim
                  autofocus
                  v-model="username"
                  :state="errors[0] ? false : valid ? true : null"
                  :placeholder="$t('fields.p_username')"
                ></b-form-input>
                <b-form-invalid-feedback>
                  {{ errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              name="f_password"
              vid="password"
              v-slot="{ valid, errors }"
            >
              <b-form-group
                id="gr-password"
                label-cols="4"
                :label="$t('fields.f_password')"
                label-for="input-2"
                :description="$t('fields.d_password')"
              >
                <b-form-input
                  id="input-2"
                  type="password"
                  trim
                  v-model="password"
                  :state="errors[0] ? false : valid ? true : null"
                  :placeholder="$t('fields.p_password')"
                ></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">
                  {{ errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <b-alert :show="loginFailed" variant="danger">
              {{ toasts.loginMessage }}
            </b-alert>

            <b-button
              type="submit"
              variant="primary"
              :disabled="user.status === 'logging'"
            >
              <font-awesome-icon icon="sign-in-alt" />
              {{ $t("actions.b_login") }}
            </b-button>
          </b-form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ModalAbout from "../components/About.vue";
import LocaleChanger from "../components/LocaleChanger.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
  components: {
    ModalAbout,
    LocaleChanger,
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      username: "",
      password: "",
      show: true
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      toasts: state => state.toasts
    }),
    registerEnabled: function() {
      return process.env.VUE_APP_API_ALLOW_REGISTER !== "";
    },
    lostPasswordEnabled: function() {
      return process.env.VUE_APP_API_ALLOW_LOST_PASSWORD !== "";
    },
    nodeEnv: function() {
      return process.env.NODE_ENV;
    },
    baseUrl: function() {
      return process.env.BASE_URL;
    },
    appID: function() {
      return process.env.VUE_APP_A2HS_APP_ID || "App ID not set";
    },
    appName: function() {
      return process.env.APP_NAME || "App name not set";
    },
    appVersion: function() {
      return process.env.APP_VERSION || "App version not set";
    },
    appApiUrl: function() {
      return process.env.VUE_APP_API_ROOT || "App API URL not set";
    },
    loginFailed: function() {
      return this.lastLoginMessage() !== "";
    }
  },
  created() {
    // reset login status
    this.logout();
  },
  methods: {
    ...mapActions("user", ["login", "logout", "recoverPassword"]),
    ...mapGetters("toasts", ["lastLoginMessage"]),
    onSubmit() {
      const { username, password } = this;
      if (username && password) {
        this.login({ username, password }).catch(error => {
          console.error("Error ***: " + error);
        });
      } else {
        this.$store.dispatch(
          "toasts/error",
          this.$t("users.d_lost_password_username")
        );
      }
    },
    lostPassword() {
      const { username } = this;
      if (username) {
        this.recoverPassword({ username });
      } else {
        this.$store.dispatch(
          "toasts/error",
          this.$t("users.d_lost_password_username")
        );
      }
    },
    resetForm() {
      this.username = "";
      this.password = "";

      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    }
  }
};
</script>
