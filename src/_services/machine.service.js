/*
 * Machine API - get and put
 */

import { backendConfig, requestOptions, handleResponse } from "../_helpers";

export const machineService = {
  get,
  post,
  postMedia,
  put
};

function get(url) {
  return fetch(
    `${backendConfig.apiUrl}${url}`,
    requestOptions.get({}, true, url)
  )
    .then(handleResponse)
    .then(body => {
      return body;
    })
    .catch(error => {
      console.log("Machine Get error:", error);
    });
}

function post(url, data) {
  return fetch(
    `${backendConfig.apiUrl}${url}`,
    requestOptions.post(data, {}, true, url)
  )
    .then(handleResponse)
    .then(body => {
      return body;
    })
    .catch(error => {
      console.log("Machine Post error:", error);
    });
}

function postMedia(url, data) {
  return fetch(
      `${backendConfig.apiUrl}${url}`,
    requestOptions.post(
      data,
      null,
      true,
      url
    )
  )
    .then(handleResponse)
    .then(body => {
      return body;
    })
    .catch(error => {
      console.log("Machine postMedia error:", error);
    });
}

function put(url, data) {
  return fetch(
    `${backendConfig.apiUrl}${url}`,
    requestOptions.put(data, {}, true, url)
  )
    .then(handleResponse)
    .then(body => {
      return body;
    })
    .catch(error => {
      console.log("Machine Put error:", error);
    });
}
