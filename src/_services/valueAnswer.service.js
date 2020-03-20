/*
 * Activities services
 */

import { backendConfig, readFromStorage } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";

export const valueAnswerService = {
  getAll,
  getById
};

function getAll(valueId = null) {
  const my_id = readFromStorage("user_id");
  const patient = `patient=${my_id}`;
  const activity = `value.id=${valueId}`;
  const sort = `order[receiptDate]=DESC`;
  const pageSize = 12;
  if (backendConfig.apiUser) {
    return machineService.get(
      `${backendConfig.valueAnswersEndpoint}?${patient}&${activity}&${sort}&pagination=true&pageSize=${pageSize}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.valueAnswersEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getById(uuid) {
  if (backendConfig.apiUser) {
    console.log("machine - av - getById");
    return machineService.get(`${backendConfig.valueAnswersEndpoint}/` + uuid);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.valueAnswersEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}
