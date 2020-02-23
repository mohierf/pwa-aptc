/*
 * Patient Health Events services
 */

import { backendConfig } from "../_helpers";
import { authHeader, handleResponse } from "../_helpers";

export const pheService = {
  getAll
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.phesEndpoint}`,
    requestOptions
  ).then(handleResponse);
}
