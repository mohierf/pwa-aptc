/*
 * Patient Health Events services
 */

import { backendConfig } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";

export const pheService = {
  getAll
};

function getAll() {
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.phesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}
