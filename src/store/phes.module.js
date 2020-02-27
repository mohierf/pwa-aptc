import { pheService } from "../services";
import { router } from "../router";

const state = {
  status: "",
  items: []
};

const actions = {
  getAll({ dispatch, commit }) {
    commit("getAllRequest");

    pheService.getAll().then(
      data => {
        commit("getAllSuccess", data);
        dispatch("toasts/success", router.app.$t("phes.ok_message"), {
          root: true
        });
      },
      error => {
        commit("getAllFailure", error);
        if (error && error !== "Unauthorized") {
          dispatch("toasts/error", error, { root: true });
        } else {
          dispatch("account/userDenied", "phes", { root: true });
        }
      }
    );
  }
};

const mutations = {
  getAllRequest(_state) {
    _state.status = "loading";
  },
  getAllSuccess(_state, data) {
    console.log(data);
    _state.status = "success";

    // let items = [];
    data["hydra:member"].forEach(phe => {
      // Remove unused information
      delete phe["patient"];
      delete phe["author"];
    });

    _state.items = data["hydra:member"];
  },
  getAllFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  }
};

export const phes = {
  namespaced: true,
  state,
  actions,
  mutations
};
