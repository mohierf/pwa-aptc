<template>
  <div id="app">
    <router-view />

    <notifications group="group-toasts"></notifications>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import update_locale from "./vee-validate";

export default {
  name: "app",
  created() {
    const defaultLanguage = navigator.language.split("-")[0];

    // Event handler for the locale changed with the locale changer component
    this.$root.$on("locale_signal", code => {
      if (code === "default") {
        code = defaultLanguage;
      }
      const localeCode = code;

      // i18n library locale update
      this.$i18n.locale = localeCode;
      const localeName = this.$i18n.t("name");

      // Set the current forms localization
      update_locale(localeCode);

      // Set the current user locale
      this.setLocale({ code: localeCode, name: localeName });

      // // Force the view update - not necessary, uncomment to reactivate
      this.$forceUpdate();
    });
  },
  computed: {
    ...mapState({
      user: state => state.user,
      notifications: state => state.toasts.queue
    })
  },
  methods: {
    ...mapActions("user", ["setLocale"])
  },
  watch: {
    notifications: {
      handler: function(queue) {
        let queueTop = queue[queue.length - 1];

        this.$notify({ ...queueTop, group: "group-toasts" });
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss">
// Import custom SASS variable overrides, or alternatively
// define your variable overrides here instead
@import "assets/custom-vars.scss";

// Import Bootstrap and BootstrapVue source SCSS files
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  margin-top: 60px;
  margin-bottom: 50px;
}
</style>
