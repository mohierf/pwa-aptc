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
  // A message specific for the login/register pages
  loginMessage: "",
  access_token: readFromStorage("access_token") || "",
  refresh_token: readFromStorage("refresh_token") || "",
  refresh_task: null,
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
              // display success message after route change completes
              dispatch("toasts/success", router.app.$t("users.ok_login"), {
                root: true
              });
            });
          },
          error => {
            commit("loginFailure", error);
            userService.logout();
          }
        );
      },
      error => {
        commit("loginFailure", error);
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
      // fixme: to make some tests, every 5 minutes -)
      when = 5 * 60 * 1000;
    }

    // Kill an existing task
    if (_state.refresh_task) {
      console.warn("Killing a former refresh task...", _state.refresh_task);
      clearTimeout(_state.refresh_task);
    }

    // Start the refresh token background task
    const refreshTask = setTimeout(() => {
      commit("refreshTask", null);
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
  lastLoginMessage: state => {
    return state.loginMessage &&
      state.loginMessage !== "null" &&
      state.loginMessage !== "undefined" &&
      Object.keys(state.loginMessage).length > 0
      ? state.loginMessage
      : "";
  },
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
    _state.loginMessage = "";
    _state.access_token = readFromStorage("access_token") || "";
    _state.refresh_token = readFromStorage("refresh_token") || "";

    const parsed = jwtParse(_state.access_token);
    if (!parsed) {
      // No token stored locally
      return;
    }
    // I got my own UUID
    writeToStorage("user_id", parsed.id);
    console.log("My UUID: ", parsed.id);

    // // Next expiry is
    // const parsed = jwtParse(_state.access_token);
    // console.log("loginSuccess, next expiry: ", parsed.exp - parsed.iat);
  },
  refreshSuccess(_state) {
    const newToken = readFromStorage("access_token") || "";
    if (_state.access_token !== newToken) {
      // console.log("jwt token changed: ", _state.access_token, newToken);
      console.log("Got a new token");
      _state.access_token = readFromStorage("access_token") || "";
    }
    _state.refresh_token = readFromStorage("refresh_token") || "";

    // // JWT information:
    // // roles, username, lastlogout
    // // The role information may be used to check that we got
    // // the correct layout for the application. As of now, only
    // // ROLE_USER is managed!
    //
    // I got my own UUID
    const parsed = jwtParse(_state.access_token);
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
  loginFailure(_state, message) {
    _state.status = "error";
    _state.loginMessage = message;
    _state.user = null;
  },
  logout(_state, message) {
    _state.status = "";
    _state.loginMessage = message;
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
