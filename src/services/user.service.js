/*
 * Users login, logout and other services
 */

import {
  backendConfig,
  authHeader,
  handleResponse,
  readFromStorage
} from "../_helpers";
import { writeToStorage, removeFromStorage } from "../_helpers/local-storage";

export const userService = {
  login,
  logout,
  register,
  recover,
  getUserProfile,
  refreshTokens
};

function login(username, password) {
  let encodedData = [];
  encodedData.push(
    encodeURIComponent("username") + "=" + encodeURIComponent(username)
  );
  encodedData.push(
    encodeURIComponent("password") + "=" + encodeURIComponent(password)
  );
  let urlEncodedData = encodedData.join("&").replace(/%20/g, "+");

  const requestOptions = {
    method: "POST",
    // Post data like forms fields
    headers: authHeader({
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    }),
    // Use form encoded data
    body: urlEncodedData
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.loginEndpoint}`,
    requestOptions
  )
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

function logout() {
  console.log("logout");
  const requestOptions = {
    method: "POST",
    headers: authHeader()
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.logoutEndpoint}`,
    requestOptions
  )
    .then(handleResponse)
    .then(() => {
      // remove user from local storage to log user out
      removeFromStorage("access_token");
      removeFromStorage("refresh_token");
    });
  // // remove user from local storage to log user out
  // removeFromStorage("access_token");
  // removeFromStorage("refresh_token");
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(user)
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.registerEndpoint}`,
    requestOptions
  ).then(handleResponse);
}

function recover(username) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: username
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.recoverEndpoint}`,
    requestOptions
  ).then(handleResponse);
}

function getUserProfile() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.profileEndpoint}`,
    requestOptions
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
  let encodedData = [];
  encodedData.push(
    encodeURIComponent("refresh_token") +
      "=" +
      encodeURIComponent(readFromStorage("refresh_token"))
  );
  let urlEncodedData = encodedData.join("&").replace(/%20/g, "+");

  const requestOptions = {
    method: "POST",
    // Post data like forms fields
    headers: authHeader({
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    }),
    // Use form encoded data
    body: urlEncodedData
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.refreshEndpoint}`,
    requestOptions
  )
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
