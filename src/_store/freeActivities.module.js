import { freeActivityService } from "../_services";
import { router } from "../_helpers/router";

const state = {
  status: "",
  items: [],
  countItems: 0,
  totalItems: 0
};

const actions = {
  getAll({ dispatch, commit }) {
    commit("getAllRequest");

    freeActivityService.getAll().then(
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
          dispatch("user/userDenied", "Activities", { root: true });
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
    _state.status = "success";
    _state.items = [];
    _state.countItems = 0;
    _state.totalItems = 0;

    if (data) {
      data["hydra:member"].forEach(freeActivity => {
        // Remove unused information
        delete freeActivity["patient"];
        delete freeActivity["prescriber"];
      });

      _state.totalItems = data["hydra:totalItems"];
      console.log("FreeActivities - Total", _state.totalItems);
      _state.countItems += data["hydra:member"].length;
      console.log("FreeActivities - Count", _state.countItems);
      // Update stored data
      _state.items = data["hydra:member"];
    }
  },
  getAllFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  }
};

const getters = {
  isLoading: _state => _state.status === "loading",
  isError: _state => _state.status === "loading",
  getError: _state => _state.error,
  isLoaded: _state => _state.status === "success",
  allItems: _state => _state.items,
  itemsCount: _state => _state.items.length
};

export const freeActivities = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
