/*
 * Machine API - get and put
 */

import { backendConfig, machineAuthHeader, handleResponse } from "../_helpers";

export const machineService = {
  get,
  put
};

function get(url) {
  // let encodedData = [];
  // encodedData.push(
  //   encodeURIComponent("username") + "=" + encodeURIComponent(username)
  // );
  // encodedData.push(
  //   encodeURIComponent("password") + "=" + encodeURIComponent(password)
  // );
  // let urlEncodedData = encodedData.join("&").replace(/%20/g, "+");
  //
  const requestOptions = {
    method: "GET",
    // Post data like forms fields
    headers: machineAuthHeader(url)
  };
  console.log(requestOptions)

  return fetch(`${backendConfig.apiUrl}${url}`, requestOptions)
    .then(handleResponse)
    .then(body => {
      console.log("get", body);
    });
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: machineAuthHeader(url),
    body: body
  };

  return fetch(`${backendConfig.apiUrl}${url}`, requestOptions)
    .then(handleResponse)
    .then(body => {
      console.log("put", body);
    });
}
