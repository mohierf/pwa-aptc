import Vue from "vue";
import Vuex from "vuex";

import VuexPersistence from "vuex-persist";
const vuexLocal = new VuexPersistence({
  key: process.env.VUE_APP_STORE_KEY || "pwa-store"
});

import { user } from "./user.module";
import { toasts } from "./toasts.module";
import { freeActivities } from "./freeActivities.module";
import { activities } from "./activities.module";
import { phes } from "./phes.module";
import { patients } from "./patients.module";
import { values } from "./values.module";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    user,
    toasts,
    freeActivities,
    activities,
    phes,
    patients,
    values
  },
  plugins: [vuexLocal.plugin]
});
