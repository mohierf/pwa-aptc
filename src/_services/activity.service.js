/*
 * Activities services
 */

import { backendConfig, readFromStorage } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";

export const activityService = {
  getAll,
  getById
};

function getAll() {
  if (backendConfig.apiUser) {
    const my_id = readFromStorage("user_id");
    return machineService.get(
      `${backendConfig.activitiesEndpoint}?patient=${my_id}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activitiesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getById(uuid) {
  console.log("Activities - getById", backendConfig.apiUser);
  if (backendConfig.apiUser) {
    return machineService.get(`${backendConfig.activitiesEndpoint}/` + uuid);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activitiesEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}
