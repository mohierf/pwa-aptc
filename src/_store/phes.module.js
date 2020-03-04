import { pheService } from "../_services";
import { router } from "../_helpers/router";

const state = {
  status: "",
  items: []
};

const actions = {
  getAll({ dispatch, commit }) {
    commit("getAllRequest");

    return pheService.getAll().then(
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
          dispatch("user/userDenied", "phes", { root: true });
        }
      }
    );
  },
  getById({ dispatch, commit, getters }, uuid) {
    const existing = getters["itemById"](uuid);
    if (existing) {
      // console.log("PHE, Still loaded", uuid);
      return Promise.resolve(existing);
    }

    commit("getOneRequest");

    return pheService.getById(uuid).then(
      data => {
        commit("getOneSuccess", data);
        dispatch("toasts/success", router.app.$t("phes.ok_message"), {
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
  },
  getOneRequest(_state) {
    _state.status = "loading";
  },
  getOneSuccess(_state, data) {
    _state.status = "success";

    console.log("getOne PHE", data);
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
    return _state.items.find(item => item.id === uuid);
  }
};

export const phes = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
