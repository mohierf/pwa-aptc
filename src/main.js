import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import { router } from "./_helpers";
import { store } from "./_store";
import { i18n } from "./i18n";

// Global importation of all the dashboard widgets components
import "./components/_dashboard";

// Font Awesome icons importation
import { library } from "@fortawesome/fontawesome-svg-core";
// Import all icons from the module
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Add  all icons to our library
library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);
// On peut maintenant utiliser <font-awesome-icon icon="coffee" /> pour afficher l'icone coffee

// Notifications utilisateur
import Notifications from "vue-notification";
Vue.use(Notifications);

// Date / time management
import VueMoment from "vue-moment";
import moment from "moment-timezone";
// Set the default timezone
moment.tz.setDefault();
moment.locale("fr");
// To view the current timezone used for non tz-aware dates:
console.log(moment.locale(), moment.tz.guess(true));
Vue.use(VueMoment, {
  moment
});

// The application service worker to manage the offline mode
import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
