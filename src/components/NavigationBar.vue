// NavigationBar.vue
<template>
  <!--
  Barre de navigation en haut de page
  -----
  configurable par les props:
  - showDev, qui permet d'afficher les boutons Afficher/Cacher
  les informationss de développement
  -->
  <div>
    <ModalAbout
      modalId="modal-about"
      :modalTitle="$t('about.title')"
      headerBgVariant="primary"
      footerBgVariant="primary"
    ></ModalAbout>

    <b-navbar toggleable="md" type="dark" variant="primary" fixed="top">
      <b-navbar-brand to="/">
        <router-link v-b-modal="'modal-about'" to="/about">
          <b-img
            src="../assets/logo.png"
            rounded="circle"
            width="32"
            alt="Application logo"
          ></b-img>
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-nav-form v-if="nodeEnv === 'development'">
          <b-button
            size="sm"
            variant="danger"
            @click="toggleShowDev"
            class="mx-3"
            >{{ buttonDev ? "Hide" : "Show" }}</b-button
          >
        </b-nav-form>

        <slot name="bar-left">
          <b-nav-text class="mx-1 text-info">{{
            $t("about.hello")
          }}</b-nav-text>
        </slot>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- Locale changer in a separate component - configure language flag + name -->
          <LocaleChanger :flag="true" :name="true" :flagHeight="32" />

          <b-nav-item to="/login" :title="$t('actions.b_logout')"
            ><font-awesome-icon icon="sign-out-alt"
          /></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import ModalAbout from "@/components/About.vue";
import LocaleChanger from "@/components/LocaleChanger.vue";

// Font awesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
library.add(faSignInAlt, faSignOutAlt);

export default {
  name: "navigation-bar",
  data() {
    return {
      buttonDev: this.showDev
    };
  },
  components: {
    ModalAbout,
    LocaleChanger
  },
  props: {
    showDev: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nodeEnv: function() {
      return process.env.NODE_ENV;
    }
  },
  methods: {
    toggleShowDev: function() {
      if (!this.buttonDev) {
        this.$emit("show-dev");
      } else {
        this.$emit("hide-dev");
      }
      this.buttonDev = !this.buttonDev;
    }
  }
};
</script>
