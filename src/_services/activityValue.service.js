/*
 * Activities services
 */

import { backendConfig, readFromStorage } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";

export const activityValueService = {
  getAll,
  getById
};

function getAll() {
  if (backendConfig.apiUser) {
    console.log("machine - av - getAll");
    const my_id = readFromStorage("user_id");
    return machineService.get(
      `${backendConfig.activityValuesEndpoint}?patient=${my_id}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activityValuesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getById(uuid) {
  if (backendConfig.apiUser) {
    console.log("machine - av - getById");
    return machineService.get(
      `${backendConfig.activityValuesEndpoint}/` + uuid
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activityValuesEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}
