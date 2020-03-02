import { patientService } from "../_services";
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

    patientService.getAll().then(
      data => {
        commit("getAllSuccess", data);
        dispatch("toasts/success", router.app.$t("patients.ok_message"), {
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
  getById({ dispatch, commit }, uuid) {
    commit("getOneRequest");

    patientService.getById(uuid).then(
      data => {
        commit("getOneSuccess", data);
        dispatch("toasts/success", router.app.$t("patients.ok_message"), {
          root: true
        });
      },
      error => {
        commit("getOneFailure", error);
        if (error && error !== "Unauthorized") {
          dispatch("toasts/error", error, { root: true });
        } else {
          dispatch("user/userDenied", "patients", { root: true });
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
      // data["hydra:member"].forEach(patient => {
      //   console.log(patient);
      // });
      _state.totalItems = data["hydra:totalItems"];
      console.log("Patients - Total", _state.totalItems);
      _state.countItems += data["hydra:member"].length;
      console.log("Patients - Count", _state.countItems);
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

    // data["hydra:member"].forEach(phe => {
    //   // Remove unused information
    //   delete phe["patient"];
    //   delete phe["author"];
    // });

    _state.items = data["hydra:member"];
  },
  getOneFailure(_state, error) {
    _state.status = "error";
    _state.error = error;
  }
};

export const patients = {
  namespaced: true,
  state,
  actions,
  mutations
};
