import { valueService } from "../_services";
import { router } from "../_helpers";

const state = {
  status: "",
  items: [],
  lastPosted: null,
  countItems: 0,
  totalItems: 0
};

const actions = {
  newValue({ dispatch, commit }, { answerDate, activity, valueAnswers }) {
    commit("valuePost");

    valueService.newValue(answerDate, activity, valueAnswers).then(
      aValue => {
        if (aValue) {
          console.log("answered", aValue);
          const alertId = aValue.id;
          commit("valueSuccess", {
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
        commit("valueFailure", error);
        dispatch("toasts/error", router.app.$t(error), { root: true });
      }
    );
  },
  setOne({ commit }, data) {
    commit("setOne", data);
  }
};

const mutations = {
  valuePost(_state) {
    _state.status = "posting";
  },
  valueSuccess(_state, data) {
    _state.status = "success";
    _state.lastPosted = data;
  },
  valueFailure(_state) {
    _state.status = "error";
    _state.lastPosted = null;
  },
  setOne(_state, data) {
    _state.status = "success";

    if (_state.items.find(item => item.id === data.id)) {
      const index = _state.items.find(item => item.id === data.id);
      _state.items[index] = data;
    } else {
      _state.items.push(data);
    }
  }
};

const getters = {
  itemsCount: _state => _state.items.length,
  allItems: _state => _state.items,
  itemById: _state => uuid => {
    return _state.items.find(item => item.id === uuid);
  },
  itemByName: _state => (name, log = false) => {
    const found = _state.items.find(item => item.name.includes(name));
    if (found && log) {
      console.log("av: ", found.id, found.name);
      console.log("- activity: ", found.activityId);
      console.log("- type: ", found.type);
      console.log("- version: ", found.version);
      console.log("- question: ", found.question);
      // console.log(
      //     "- author: ",
      //     found.author.id,
      //     found.author.firstname,
      //     found.author.lastname
      // );
      console.log("- board display: ", found.boardDisplay);
      console.log("- mandatory answer: ", found.mandatoryAnswer);

      console.log("- properties: ", found.properties);
      console.log("  - bounds type: ", found.properties.boundsType);
      // console.log("  - bounds types: ", found.properties.boundsTypes);
      console.log("  - min value: ", found.properties.minValue);
      console.log("  - max value: ", found.properties.maxValue);
      console.log(
        "  - computed min value: ",
        found.properties.computedMinValue
      );
      console.log(
        "  - computed max value: ",
        found.properties.computedMaxValue
      );
      console.log("  - reference value: ", found.properties.referenceValue);
      console.log("  - initial value: ", found.properties.initialValue);
      // console.log("  - initial value options: ", found.properties.initialValueOptions);
      console.log("  - step: ", found.properties.step);
      // console.log("  - steps: ", found.properties.steps);
      // console.log("  - unit: ", found.properties.unit);
      console.log("  - unit literal: ", found.properties.unitLiteral);
    }
    return found;
  }
};

export const values = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
