import { dailyMessageService } from "../_services";
import { router } from "../_helpers";

const state = {
  status: "",
  items: [],
  lastPosted: null,
  countItems: 0,
  totalItems: 0
};

const actions = {
  getAll({ dispatch, commit }, parameters) {
    commit("getAllRequest");

    return dailyMessageService.getAll(parameters).then(
      data => {
        commit("getAllSuccess", data);
        dispatch("toasts/success", router.app.$t("valuesAnswers.ok_message"), {
          root: true
        });
        return data;
      },
      error => {
        commit("getAllFailure", error);
        if (error && error !== "Unauthorized") {
          dispatch("toasts/error", error, { root: true });
        } else {
          dispatch("user/userDenied", "Answers", { root: true });
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

    // Only retain the last 5 messages
    if (_state.items.length > 5) {
      _state.items.splice(0, _state.items.length - 5 + 1);
    }
    _state.items.push(data);
  },
  getAllFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  }
};

const getters = {
  itemsCount: _state => _state.items.length,
  allItems: _state => _state.items,
  itemById: _state => uuid => {
    return _state.items.find(item => item.id === uuid);
  },
  itemByIndex: _state => index => {
    return _state.items[index];
  }
};

export const dailyMessages = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
