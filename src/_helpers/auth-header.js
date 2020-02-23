/*
 * Add the JWT authentication token into the standard HTTP header
 * -----
 * As a parameter it receives the token type, default is
 * access_token, else it should be refresh_token.
 */
import { readFromStorage } from "./local-storage";

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
