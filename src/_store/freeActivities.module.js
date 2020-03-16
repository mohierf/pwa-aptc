import { freeActivityService } from "../_services";
import { router } from "../_helpers";

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
  getById({ dispatch, commit }, uuid) {
    commit("getOneRequest");

    return freeActivityService.getById(uuid).then(
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
    return _state.items.find(item => item.id === uuid);
  },
  itemByName: _state => name => {
    return _state.items.find(item => item.activity.name.includes(name));
  },
  valueByName: _state => (name, log = false) => {
    // Parse all activities to search for the first value meeting the name requirement
    for (let index = 0; index < _state.items.length; index++) {
      const activity = _state.items[index];
      if (!activity) {
        continue;
      }
      const values = activity.activity.activityValues;
      const found =
        values &&
        values.find(
          item =>
            item.value.active &&
            item.value.name &&
            item.value.name.includes(name)
        );
      if (values && found) {
        let value = found.value;
        // Get the IRI
        value["activityId"] = activity.activity["@id"];
        // // Get the ID
        // value["activityId"] = activity.activity["id"];

        if (log) {
          console.log("av: ", value.id, value.name);
          console.log("- activity: ", value.activityId);
          console.log("- type: ", value.type);
          console.log("- version: ", value.version);
          console.log("- question: ", value.question);
          // console.log(
          //     "- author: ",
          //     value.author.id,
          //     value.author.firstname,
          //     value.author.lastname
          // );
          console.log("- board display: ", value.boardDisplay);
          console.log("- mandatory answer: ", value.mandatoryAnswer);

          console.log("- properties: ", value.properties);
          console.log("  - bounds type: ", value.properties.boundsType);
          // console.log("  - bounds types: ", value.properties.boundsTypes);
          console.log("  - min value: ", value.properties.minValue);
          console.log("  - max value: ", value.properties.maxValue);
          console.log(
            "  - computed min value: ",
            value.properties.computedMinValue
          );
          console.log(
            "  - computed max value: ",
            value.properties.computedMaxValue
          );
          console.log("  - reference value: ", value.properties.referenceValue);
          console.log("  - initial value: ", value.properties.initialValue);
          // console.log("  - initial value options: ", value.properties.initialValueOptions);
          console.log("  - step: ", value.properties.step);
          // console.log("  - steps: ", value.properties.steps);
          // console.log("  - unit: ", value.properties.unit);
          console.log("  - unit literal: ", value.properties.unitLiteral);
        }

        return value;
      }

      // return undefined;
    }
  }
};

export const freeActivities = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
