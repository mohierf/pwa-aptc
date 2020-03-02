/*
 * Users login, logout and other services
 */

import {
  backendConfig,
  requestOptions,
  userHeaders,
  handleResponse,
  readFromStorage,
  formEncode
} from "../_helpers";
import { writeToStorage, removeFromStorage } from "../_helpers/local-storage";

export const userService = {
  login,
  logout,
  getUserProfile,
  refreshTokens
};

function login(username, password) {
  return fetch(`${backendConfig.apiUrl}${backendConfig.loginEndpoint}`, {
    method: "POST",
    // Use form encoded data
    ...userHeaders({
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    }),
    body: formEncode({ username: username, password: password })
  })
    .then(handleResponse)
    .then(tokens => {
      if (tokens.token && tokens.refresh_token) {
        // store the jwt tokens in the local storage to keep user logged in between page refreshes
        writeToStorage("access_token", tokens.token);
        writeToStorage("refresh_token", tokens.refresh_token);
      }
    });
}

function logout() {
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.logoutEndpoint}`,
    requestOptions.post()
  )
    .then(handleResponse)
    .then(() => {
      // remove user from local storage to log user out
      removeFromStorage("access_token");
      removeFromStorage("refresh_token");
    });
}

function getUserProfile() {
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.profileEndpoint}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(profile => {
      // Set the default profile layout if none (or empty) is provided
      if (!profile.layout || Object.entries(profile.layout).length === 0) {
        profile.layout = require("../assets/layout-default.json");
      }
      // Check an existing language - this to check if the profile is the expected one
      if (!profile.language) {
        return Promise.reject("Missing user language in the profile");
      }

      return profile;
    });
}

function refreshTokens() {
  console.log("Refresh token...");
  return fetch(`${backendConfig.apiUrl}${backendConfig.refreshEndpoint}`, {
    method: "POST",
    // Use form encoded data
    ...userHeaders({
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    }),
    body: formEncode({ refresh_token: readFromStorage("refresh_token") })
  })
    .then(handleResponse)
    .then(tokens => {
      // login successful if there's a jwt token in the response
      // response contains:
      // {
      //   "token": "string",
      //   "refresh_token": "string"
      // }
      if (tokens.token && tokens.refresh_token) {
        // store the jwt tokens in the local storage to keep user logged in between page refreshes
        writeToStorage("access_token", tokens.token);
        writeToStorage("refresh_token", tokens.refresh_token);
      }
    });
}
