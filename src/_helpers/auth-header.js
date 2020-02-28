/*
 * Add the JWT authentication token into the standard HTTP header
 * -----
 * As a parameter it receives the token type, default is
 * access_token, else it should be refresh_token.
 */
import { readFromStorage } from "./local-storage";
const CryptoJS = require("crypto-js");

// PreProd
const userApi = "fmohier";
// const tokenApi = "$2y$15$YwyQnvuth7AdFCl5CoovwOU0n4ta7oImmrGSqaco.6eRFZ.EH6NIO";
const tokenApi = "$2y$15$YwyQnvuth7AdFCl5CoovwOU0n4ta7oImmrGSqAco.6eRFZ.EH6NIO";

// Local
// const userApi = "fmohier";
// const tokenApi = "$2y$15$e/U8q6v08AKE.2nR7QHSH.qe7KoIi7nsZ7bYs6eB2rLVFVwcMnfZG";
// const userApi = "api_create_data";
// const tokenApi = "$2y$15$/ncJgS/t1JHjLkdFTBPDmeegkZrDTcxPnlLgdSWcivTWJ87lpbM.S";

export function authHeader(headers = {}) {
  // Set authorization header with jwt access token
  let token = readFromStorage("access_token") || "";

  if (!("Content-Type" in headers)) {
    headers["Content-Type"] = "application/ld+json";
  }
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
}

export function machineAuthHeader(url) {
  return {
    "Content-Type": "application/ld+json",
    "x-auth-token": createSignature(url)
  };
}

function createSignature(url) {
  const timestamp = Math.floor(Date.now() / 1000);
  const endpoint =
    url.indexOf("?") !== -1 ? url.substring(0, url.indexOf("?")) : url;
  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(endpoint + timestamp, tokenApi)
  );

  let buff = new Buffer(userApi + ":" + signature);
  return buff.toString("base64");
}
