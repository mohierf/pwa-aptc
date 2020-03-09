import { userService } from "../_services";
// import { machineService } from "../_services";
import { jwtParse, writeToStorage } from "../_helpers";
import { router } from "../_helpers";
import { readFromStorage } from "../_helpers/local-storage";
// import moment from "moment";

/*
 * We could store the user access token/refresh token in vuex store,
 * but if the user leaves our application, all of the data in
 * the vuex store disappears.
 * To ensure we allow the user to return to the application within
 * the validity time of the token and not have to log in again,
 * we have to keep the token in the browser localStorage.
 */
const state = {
  status: "",
  access_token: readFromStorage("access_token") || "",
  refresh_token: readFromStorage("refresh_token") || "",
  user: {}
};

const actions = {
  login({ dispatch, commit }, { username, password }) {
    commit("loginRequest", { username });

    userService.login(username, password).then(
      () => {
        commit("loginSuccess");

        // Set a background refresh task to refresh the tokens
        dispatch("refreshTokens");

        // Get user profile
        userService.getUserProfile().then(
          userProfile => {
            commit("profileSuccess", userProfile);

            // Navigate to home page
            router.push("/");
            setTimeout(() => {
              dispatch("toasts/loginClear", "", { root: true });

              // display success message after route change completes
              dispatch("toasts/success", router.app.$t("users.ok_login"), {
                root: true
              });
            });
          },
          error => {
            commit("loginFailure", error);
            dispatch("toasts/loginAlert", error, { root: true });
            userService.logout();
          }
        );
      },
      error => {
        commit("loginFailure", error);
        dispatch("toasts/loginAlert", error, { root: true });
        dispatch("logout", error);
      }
    );
  },
  logout({ commit }, message) {
    // Navigate to login page if it is not the current page
    // console.warn("Current path: ", router.currentRoute);
    if (router.currentRoute.path !== "/login") {
      userService.logout();

      router.push("/login").catch(err => {
        console.error("Login page is not available!", err);
      });
    }

    commit("logout", message);
  },
  refreshTokens({ state: _state, commit, dispatch }, when) {
    // Get next expiry date for the access token
    const now = Date.now() / 1000;
    const parsed = jwtParse(_state.access_token);
    if (!parsed) {
      // No token stored locally
      return;
    }

    if (when === undefined) {
      // No refresh timer specified, then compute the next refresh
      // when is 0 on page refresh to force a refresh token check
      // Three minutes before the real expiry. Why 3? Why not -)
      let timeUntilRefresh = parseInt(parsed.exp) - now;
      timeUntilRefresh -= 3 * 60;
      when = timeUntilRefresh * 1000;
    }

    // Start the refresh token background task
    const refreshTask = setTimeout(() => {
      userService.refreshTokens().then(
        () => {
          commit("refreshSuccess");
          setTimeout(() => {
            dispatch("refreshTokens");
          });
        },
        error => {
          dispatch("logout", "Failed refreshing tokens: " + error);
        }
      );
    }, when);
    commit("refreshTask", refreshTask);
  },
  register({ dispatch, commit }, data) {
    commit("registerRequest");

    userService.register(data).then(
      newUser => {
        commit("registerSuccess", newUser);

        // Navigate to login page
        router.push("/login");
        setTimeout(() => {
          dispatch("toasts/loginClear", "", { root: true });

          // display success message after route change completes
          dispatch("toasts/success", router.app.$t("users.ok_register"), {
            root: true
          });
        });
      },
      error => {
        commit("registerFailure");
        dispatch("toasts/loginAlert", router.app.$t(error), { root: true });
      }
    );
  },
  setLocale({ dispatch, commit }, locale) {
    commit("setLocale", locale.code);
    dispatch(
      "toasts/success",
      router.app.$t("users.ok_language", {
        code: locale.code,
        name: locale.name
      }),
      {
        root: true
      }
    );
  },

  userDenied({ commit }, message) {
    commit("userDenied", message);
  }
};

const getters = {
  isLoggedIn: _state => !!_state.access_token,
  isAuthorized: _state => {
    return _state.status && _state.status !== "denied";
  },
  friendlyName: _state => {
    // Returns, in order of preference, prénom+nom, prénom, nom, sinon Inconnu
    return _state.user
      ? _state.user.firstname && _state.user.lastname
        ? _state.user.firstname + " " + _state.user.lastname
        : _state.user.firstname
        ? _state.user.firstname
        : _state.user.lastname
        ? _state.user.lastname
        : router.app.$t("users.unnamed")
      : router.app.$t("users.unconnected");
  },
  role: _state => {
    return _state.user ? _state.user.role : "";
  },
  layout: _state => {
    return _state.user ? _state.user.layout : "";
  }
};

const mutations = {
  loginRequest(_state, _user) {
    _state.status = "logging";
    _state.user = _user;
  },
  loginSuccess(_state) {
    _state.status = "success";
    _state.access_token = readFromStorage("access_token") || "";
    _state.refresh_token = readFromStorage("refresh_token") || "";

    const parsed = jwtParse(_state.access_token);
    // I got my own UUID
    writeToStorage("user_id", parsed.id);
    console.log("My UUID: ", parsed.id);

    // // Next expiry is
    // const parsed = jwtParse(_state.access_token);
    // console.log("loginSuccess, next expiry: ", parsed.exp - parsed.iat);
  },
  refreshSuccess(_state) {
    _state.access_token = readFromStorage("access_token") || "";
    _state.refresh_token = readFromStorage("refresh_token") || "";

    // // JWT information:
    // // roles, username, lastlogout
    // // The role information may be used to check that we got
    // // the correct layout for the application. As of now, only
    // // ROLE_USER is managed!
    //
    const parsed = jwtParse(_state.access_token);
    // I got my own UUID
    writeToStorage("user_id", parsed.id);

    // // Next expiry is
    // console.log("refreshSuccess, next expiry: ", parsed.exp - parsed.iat);
    //
    // // iat and exp are UTC timestamps - no need to specify a TZ
    // let iat = moment(parsed.iat * 1000);
    // // default format is ISO8601
    // console.log(iat.format());
    //
    // let expiry = moment(parsed.exp * 1000);
    // // default format is ISO8601
    // console.log(expiry.format());
  },
  refreshTask(_state, task) {
    _state.refresh_task = task;
  },
  profileSuccess(_state, _user) {
    _state.user = _user;
  },
  loginFailure(_state) {
    _state.status = "error";
    _state.user = null;
  },
  logout(_state, message) {
    _state.status = "";
    _state.user = null;
    _state.access_token = "";
    _state.refresh_token = "";
    // Clear an existing token refresh timer
    if (_state.refresh_task) {
      clearTimeout(_state.refresh_task);
    }
    if (message) {
      console.warn("Logout because: " + message);
    }
  },
  registerRequest(_state) {
    _state.status = "registering";
    _state.user = null;
  },
  registerSuccess(_state, _user) {
    _state.status = "registered";
    _state.user = _user;
  },
  registerFailure(_state) {
    _state.status = "error";
    _state.user = null;
  },
  setLocale(_state, code) {
    if (_state.user) {
      _state.user.languageCode = code;
    }
  },
  userDenied(_state, message) {
    console.warn(
      "Access denied for the current logged-in user, component: " + message
    );
    _state.status = "denied";
  }
};

export const user = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
