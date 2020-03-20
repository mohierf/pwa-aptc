<template>
  <div id="app">
    <router-view />

    <notifications group="group-toasts"></notifications>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
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

    // Set a background refresh task to refresh the tokens
    this.$store.dispatch("user/refreshTokens", 0);

    // Only if a user signed in
    this.$root.$on("user_signed_in", () => {
      // Get activities
      this.loadAllFreeActivities().then(() => {
        // Synchronise to be sure to get real activities...
        const sleep = ms => {
          return new Promise(resolve => setTimeout(resolve, ms));
        };

        const start = async () => {
          const allItems = this.allItems;
          // Use a for() loop because forEach is not really able to chain promises:/
          for (let index = 0; index < allItems.length; index++) {
            const freeActivity = allItems[index];
            // fixme: must wait some few ms else the backend returns a 403 status!
            await sleep(100).then(() =>
              this.loadOneFreeActivity(freeActivity.id)
            );
          }

          // Raise an event when all activities are fully loaded
          this.$root.$emit("got_all_my_activities");
        };
        start();
      });

      // Get daily message
      this.loadAllDailyMessages().then(() => {
        // Raise an event when all activities are fully loaded
        this.$root.$emit("got_all_my_messages");
      });
    });
  },
  mounted() {
    this.userIsLoggedIn && this.$root.$emit("user_signed_in");
  },
  computed: {
    ...mapState({
      user: state => state.user,
      notifications: state => state.toasts.queue
    }),
    ...mapGetters("user", {
      userIsLoggedIn: "isLoggedIn"
    }),
    ...mapGetters({
      allItems: "freeActivities/allItems",
      userIsLoggedIn: "user/isLoggedIn"
    })
  },
  methods: {
    ...mapActions("user", ["setLocale"]),
    ...mapActions("freeActivities", {
      loadAllFreeActivities: "getAll",
      loadOneFreeActivity: "getById"
    }),
    ...mapActions("dailyMessages", {
      loadAllDailyMessages: "getAll"
    })
    // ...mapActions({
    //   loadAllFreeActivities: "freeActivities/getAll",
    //   loadOneFreeActivity: "freeActivities/getById"
    // })
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
