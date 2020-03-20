import Vue from "vue";
import Vuex from "vuex";

import VuexPersistence from "vuex-persist";
const vuexLocal = new VuexPersistence({
  key: process.env.VUE_APP_STORE_KEY || "pwa-store"
});

import { answers } from "./answers.module";
import { dailyMessages } from "./dailyMessages.module";
import { freeActivities } from "./freeActivities.module";
import { patients } from "./patients.module";
import { medias } from "./medias.module";
import { phes } from "./phes.module";
import { toasts } from "./toasts.module";
import { user } from "./user.module";
import { values } from "./values.module";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    answers,
    dailyMessages,
    freeActivities,
    medias,
    patients,
    phes,
    toasts,
    user,
    values
  },
  plugins: [vuexLocal.plugin]
});
