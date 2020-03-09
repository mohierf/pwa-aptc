/*
 * Activities services
 */

import { backendConfig, readFromStorage } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";

export const valueService = {
  raise,
  getAll,
  getById
};

function raise(activity, valueAnswers, answerDate) {
  const data = JSON.stringify({
    activity: activity,
    valueAnswers: valueAnswers,
    answerDate: answerDate
  });
  console.log("Answer:", data);

  if (backendConfig.apiUser) {
    console.log("machine - value - raise");
    return machineService.post(`${backendConfig.answerEndpoint}`);
  }
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.answerEndpoint}`,
    requestOptions.post(data)
  ).then(handleResponse);
}

function getAll() {
  if (backendConfig.apiUser) {
    console.log("machine - av - getAll");
    const my_id = readFromStorage("user_id");
    return machineService.get(
      `${backendConfig.valuesEndpoint}?patient=${my_id}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.valuesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getById(uuid) {
  if (backendConfig.apiUser) {
    console.log("machine - av - getById");
    return machineService.get(`${backendConfig.valuesEndpoint}/` + uuid);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.valuesEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}
