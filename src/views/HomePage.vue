<template>
  <div>
    <NavigationBar
      :show-dev="showDev"
      v-on:show-dev="showDev = true"
      v-on:hide-dev="showDev = false"
    >
      <template v-slot:bar-left>
        <b-nav-text class="mx-1">{{
          $t("home.hello", { user: userFriendlyName })
        }}</b-nav-text>
      </template>
    </NavigationBar>

    <!-- Only in development mode -->
    <b-container v-if="showDev">
      <b-jumbotron class="m-3 p-5 bg-info">
        <h1>{{ $t("home.title") }}</h1>
        <p>{{ $t("users.roles." + userRole) }} - {{ userFriendlyName }}</p>
      </b-jumbotron>

      <hr />
      <p>Environment variables (from process.env):</p>
      <dl class="row">
        <dt class="col-sm-3">Node env :</dt>
        <dd class="col-sm-9">{{ nodeEnv }}</dd>
        <dt class="col-sm-3">Base URL:</dt>
        <dd class="col-sm-9">{{ baseUrl }}</dd>
        <dt class="col-sm-3">App Id:</dt>
        <dd class="col-sm-9">{{ appID }}</dd>
        <dt class="col-sm-3">App name:</dt>
        <dd class="col-sm-9">{{ appName }}</dd>
        <dt class="col-sm-3">App version:</dt>
        <dd class="col-sm-9">{{ appVersion }}</dd>
        <dt class="col-sm-3">App API URL:</dt>
        <dd class="col-sm-9">{{ appApiUrl }}</dd>
      </dl>
    </b-container>

    <b-container fluid="sm" v-if="userLayout">
      <!-- Only in development mode -->
      <b-jumbotron v-if="showDev" class="m-3 p-5 bg-success">
        <h1>Layout id: {{ userLayout.id }}, type is: {{ userLayout.type }}</h1>
        <h2>User role: {{ userRole }}</h2>
      </b-jumbotron>

      <b-row
        v-for="row in userLayout.rows"
        :key="row.id"
        class="my-1"
        no-gutters
      >
        <b-col v-if="row.title" cols="12">
          <h3 class="text-left text-secondary">{{ row.title }}</h3>
        </b-col>

        <b-col
          v-for="column in row.columns"
          :key="column.id"
          class="p-1"
          :class="column.span"
        >
          <component
            v-if="column.widget"
            :is="
              column.widget.startsWith('cmp-') ||
              column.widget.startsWith('Cmp')
                ? column.widget
                : 'cmp-' + column.widget
            "
            :data="column.data"
          >
          </component>

          <b-card v-else bg-variant="danger" text-variant="white">
            <b-card-text>
              <cite>
                Missing <code class="text-primary">widget</code> property in the
                column data.
              </cite>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <b-jumbotron v-else class="m-3">
      <!-- While loading user layout definition... -->
      <h1>
        <font-awesome-icon icon="spinner" size="2x" spin></font-awesome-icon>
        &nbsp; {{ $t("actions.t_loading") }}
      </h1>
    </b-jumbotron>

    <FooterBar />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { readFromStorage } from "../_helpers";

import NavigationBar from "../components/NavigationBar";
import FooterBar from "../components/FooterBar";

export default {
  data() {
    return {
      showDev: this.nodeEnv === "development"
    };
  },
  components: {
    NavigationBar,
    FooterBar
  },
  mounted() {
    // Check language consistency
    if (this.user.user.language) {
      let userLanguage = this.user.user.language;
      if (this.user.user.language.includes("-")) {
        userLanguage = this.user.user.language.split("-")[0];
      }
      if (this.$i18n.locale !== userLanguage) {
        // Update current application language
        this.$root.$emit("locale_signal", userLanguage);
      }
    } else {
      // Update current application language
      this.$root.$emit("locale_signal", this.$i18n.locale);
    }

    if (!this.userIsAuthorized) {
      this.$store.dispatch("toasts/error", "Current user access is denied!", {
        root: true
      });
      location.replace("/login");
    }

    // this.$store.dispatch("patients/getAll");
    this.$store.dispatch("patients/getById", readFromStorage("user_id"));
  },
  computed: {
    ...mapState({
      user: state => state.user,
      users: state => state.users.all,
      toasts: state => state.toasts
    }),
    ...mapGetters("user", {
      userIsLoggedIn: "isLoggedIn",
      userIsAuthorized: "isAuthorized",
      userFriendlyName: "friendlyName",
      userRole: "role",
      userLayout: "layout"
    }),
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
    }
  }
};
</script>
