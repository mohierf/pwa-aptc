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

    return freeActivityService.getAll().then(
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
  },
  getById({ dispatch, commit, getters }, uuid) {
    const existing = getters["itemById"](uuid);
    if (existing) {
      console.debug("freeActivity, Still loaded... load anyway -(", uuid);
    }

    commit("getOneRequest");

    return freeActivityService.getById(uuid).then(
      data => {
        commit("getOneSuccess", data);
        dispatch("toasts/success", router.app.$t("activities.ok_message"), {
          root: true
        });
      },
      error => {
        commit("getOneFailure", error);
        if (error && error !== "Unauthorized") {
          dispatch("toasts/error", error, { root: true });
        } else {
          dispatch("user/userDenied", "phes", { root: true });
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
      _state.countItems += data["hydra:member"].length;
      // Update stored data
      _state.items = data["hydra:member"];
    }
  },
  getAllFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  },
  getOneRequest(_state) {
    _state.status = "loading";
  },
  getOneSuccess(_state, data) {
    _state.status = "success";

    // Remove unused information
    delete data["patient"];
    delete data["prescriber"];

    if (_state.items.find(item => item.id === data.id)) {
      const index = _state.items.findIndex(item => item.id === data.id);
      _state.items[index] = data;
    } else {
      _state.items.push(data);
    }
  },
  getOneFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  }
};

const getters = {
  isLoading: _state => _state.status === "loading",
  isError: _state => _state.status === "loading",
  getError: _state => _state.error,
  isLoaded: _state => _state.status === "success",
  itemsCount: _state => _state.items.length,
  allItems: _state => _state.items,
  itemById: _state => uuid => {
    const found = _state.items.find(item => item.id === uuid);
    return found;
  },
  itemByName: _state => name => {
    const found = _state.items.find(item => item.activity.name.includes(name));
    // console.log("Found free activity by name: ", found && found.activity.name);
    // console.log("Found free activity by name: ", found);
    return found;
  }
};

export const freeActivities = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};