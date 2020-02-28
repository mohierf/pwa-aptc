/*
 * Machine API - get and put
 */

import { backendConfig, machineAuthHeader, handleResponse } from "../_helpers";

export const machineService = {
  get,
  put
};

function get(url) {
  const requestOptions = {
    method: "GET",
    // Post data like forms fields
    headers: machineAuthHeader(url)
  };
  console.log(requestOptions);

  return fetch(`${backendConfig.apiUrl}${url}`, requestOptions)
    .then(handleResponse)
    .then(body => {
      console.log("get", body);
    })
    .catch(error => {
      console.log("Get error:", error);
    });
}

function put(url, data) {
  const requestOptions = {
    method: "PUT",
    headers: machineAuthHeader(url),
    body: data
  };

  return fetch(`${backendConfig.apiUrl}${url}`, requestOptions)
    .then(handleResponse)
    .then(body => {
      console.log("put", body);
    })
    .catch(error => {
      console.log(error);
    });
}
