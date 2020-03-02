/*
 * Patient Health Events services
 */

import { backendConfig } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";

export const pheService = {
  getAll,
  getById
};

function getAll() {
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.phesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getById(uuid) {
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.phesEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}
