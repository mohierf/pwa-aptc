import { activityService } from "../services";
import { router } from "../router";

const state = {
  status: "",
  items: []
};

const actions = {
  getAll({ dispatch, commit }) {
    commit("getAllRequest");

    activityService.getAll().then(
      data => {
        commit("getAllSuccess", data);
        dispatch("toasts/success", router.app.$t("activities.ok_message"), {
          root: true
        });
      },
      error => {
        commit("getAllFailure", error);
        if (error && error !== "Unauthorized") {
          dispatch("toasts/error", error, { root: true });
        } else {
          dispatch("account/userDenied", "Activities", { root: true });
        }
      }
    );
  }
};

const mutations = {
  getAllRequest(_state) {
    _state.status = "loading";
  },
  getAllSuccess(_state, gotActivities) {
    _state.status = "success";

    // let items = [];
    gotActivities["hydra:member"].forEach(freeActivity => {
      // Remove unused information
      delete freeActivity["patient"];
      delete freeActivity["prescriber"];
    });

    _state.items = gotActivities["hydra:member"];
  },
  getAllFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  }
};

export const activities = {
  namespaced: true,
  state,
  actions,
  mutations
};
