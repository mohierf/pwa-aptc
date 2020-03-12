import { valueAnswerService } from "../_services";
import { router } from "../_helpers";

const state = {
  status: "",
  items: [],
  countItems: 0,
  totalItems: 0
};

const actions = {
  getAll({ dispatch, commit }, valueId) {
    commit("getAllRequest");

    console.log("Get all VA");
    return valueAnswerService.getAll(valueId).then(
      data => {
        commit("getAllSuccess", data);
        dispatch("toasts/success", router.app.$t("activities.ok_message"), {
          root: true
        });
        return data;
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
      data["hydra:member"].forEach(valueAnswer => {
        // Remove unused information
        delete valueAnswer["activityAnswer"];
        delete valueAnswer["patient"];
        delete valueAnswer["patientAlerts"];
        delete valueAnswer["privateValue"];
        delete valueAnswer["value"];
      });

      _state.totalItems = data["hydra:totalItems"];
      console.log("valueAnswers - All, total", _state.totalItems);
      _state.countItems += data["hydra:member"].length;
      console.log("valueAnswers - All, count", _state.countItems);
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

    console.warn("activityValues getOneSuccess: ", data);
    let found = _state.items.find(item => item.id === data.id);
    if (found) {
      const index = _state.items.find(item => item.id === data.id);
      // Remove unused information
      delete data["patient"];
      delete data["prescriber"];
      _state.items[index] = data;
    } else {
      _state.items.push(data);
    }
    console.warn("activityValues count: ", _state.items.length);
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

export const valueAnswers = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
