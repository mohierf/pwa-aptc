/*
 * Activities services
 */

import { backendConfig, readFromStorage } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";

export const freeActivityService = {
  getAll,
  getById
};

function getAll() {
  if (backendConfig.apiUser) {
    const my_id = readFromStorage("user_id");
    return machineService.get(
      `${backendConfig.freeActivitiesEndpoint}?patient=${my_id}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.freeActivitiesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getById(uuid) {
  if (backendConfig.apiUser) {
    return machineService.get(
      `${backendConfig.freeActivitiesEndpoint}/${uuid}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.freeActivitiesEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}
