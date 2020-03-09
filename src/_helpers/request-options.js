import { readFromStorage } from "./local-storage";
import { backendConfig } from "../_helpers";

const CryptoJS = require("crypto-js");

// import axios from 'axios';
//
// export const HTTP = axios.create({
//   baseURL: `http://jsonplaceholder.typicode.com/`,
//   headers: {
//     Authorization: 'Bearer {token}'
//   }
// })
//
// axios.get("weather.json").then(response => (this.weatherDataList = response.data))
//
export const requestOptions = {
  get(headers = {}, machine = false, url = null) {
    return {
      method: "GET",
      ...userHeaders(headers, machine, url)
    };
  },
  post(body, headers = {}, machine = false, url = null) {
    return {
      method: "POST",
      ...userHeaders(headers, machine, url),
      body: body
    };
  },
  patch(body, headers = {}, machine = false, url = null) {
    return {
      method: "PATCH",
      ...userHeaders(headers, machine, url),
      body: JSON.stringify(body)
    };
  },
  put(body, headers = {}, machine = false, url = null) {
    return {
      method: "PUT",
      ...userHeaders(headers, machine, url),
      body: JSON.stringify(body)
    };
  },
  delete(headers = {}) {
    return {
      method: "DELETE",
      ...userHeaders(headers)
    };
  }
};

function userHeaders(headers = null, machine = false, url = null) {
  // Machine API - specific headers
  if (machine) {
    return machineHeaders(headers, url);
  }

  // If headers are null, we do not even want any content type!
  if (headers !== null && !("Content-Type" in headers)) {
    headers = { "Content-Type": "application/ld+json" };
  }
  // Set authorization header with jwt access token
  const token = readFromStorage("access_token") || {};
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  return { headers: headers };
}
export { userHeaders };

function machineHeaders(headers = null, url = null) {
  const timestamp = Math.floor(Date.now() / 1000);
  const endpoint =
    url.indexOf("?") !== -1 ? url.substring(0, url.indexOf("?")) : url;
  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(endpoint + timestamp, backendConfig.apiToken)
  );

  // If headers are null, we do not even want any content type!
  if (headers !== null && !("Content-Type" in headers)) {
    headers = { "Content-Type": "application/ld+json" };
  }
  // Set authorization header with machine specific access token
  let buff = new Buffer(backendConfig.apiUser + ":" + signature);
  if (headers === null) {
    headers = {}
  }
  headers["x-auth-token"] = buff.toString("base64");

  return { headers: headers };
}
