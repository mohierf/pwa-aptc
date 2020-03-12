import { answerService } from "../_services";
import { router } from "../_helpers";

const state = {
  status: "",
  items: [],
  lastPosted: null,
  countItems: 0,
  totalItems: 0
};

const actions = {
  getAllValuesAnswers({ dispatch, commit }, parameters) {
    commit("getAllRequest");

    return answerService.getAllValuesAnswers(parameters).then(
      data => {
        commit("getAllValuesSuccess", data);
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
  },
  getAllActivitiesAnswers({ dispatch, commit }, parameters) {
    commit("getAllRequest");

    return answerService.getAllActivitiesAnswers(parameters).then(
      data => {
        commit("getAllActivitiesSuccess", data);
        dispatch("toasts/success", router.app.$t("activitiesAnswers.ok_message"), {
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
  },
  getById({ dispatch, commit }, uuid) {
    commit("getOneRequest");

    return answerService.getActivityAnswerById(uuid).then(
      data => {
        commit("getOneSuccess", data);
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
  },
  raise({ dispatch, commit }, { answerDate, activity, valueAnswers }) {
    commit("answerPost");

    answerService.raise(answerDate, activity, valueAnswers).then(
      aValue => {
        if (aValue) {
          console.log("answered", aValue);
          const alertId = aValue.id;
          commit("answerSuccess", {
            id: alertId,
            answerDate,
            activity,
            valueAnswers
          });
          setTimeout(() => {
            // display success message after route change completes
            dispatch("toasts/success", router.app.$t("alert.ok_message"), {
              root: true
            });
          });
        }
      },
      error => {
        // Using this may raise an error in the FF console because of unhandled exception!
        commit("answerFailure", error);
        dispatch("toasts/error", router.app.$t(error), { root: true });
      }
    );
  }
};

const mutations = {
  getAllRequest(_state) {
    _state.status = "loading";
  },
  getAllValuesSuccess(_state, data) {
    _state.status = "success";

    // data["hydra:member"].forEach(answer => {
    //   // Remove unused information
    //   delete answer["patient"];
    //   delete answer["author"];
    // });

    _state.items = data["hydra:member"];
  },
  getAllActivitiesSuccess(_state, data) {
    _state.status = "success";

    // data["hydra:member"].forEach(answer => {
    //   // Remove unused information
    //   delete answer["patient"];
    //   delete answer["author"];
    // });

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

    console.log("getOne Answer", data);
  },
  getOneFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  },
  answerPost(_state) {
    _state.status = "posting";
  },
  answerSuccess(_state, data) {
    _state.status = "success";
    _state.lastPosted = data;
  },
  answerFailure(_state) {
    _state.status = "error";
    _state.lastPosted = null;
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

export const answers = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
