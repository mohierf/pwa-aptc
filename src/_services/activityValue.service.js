/*
 * Activities services
 */

import { backendConfig } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";

export const activityValueService = {
  getAll,
  getById
};

function getAll(activityId = null) {
  if (backendConfig.apiUser) {
    console.log("machine - av - getAll", activityId);
    return machineService.get(
      `${backendConfig.activityValuesEndpoint}?activity=${activityId}`
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
