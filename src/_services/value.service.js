/*
 * Values services
 */

import { backendConfig, requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";
import { uuid } from "vue-uuid";

export const valueService = {
  getById,
  newValue
};

function getById(uuid) {
  console.log("Answers - getById", backendConfig.apiUser);
  if (backendConfig.apiUser) {
    return machineService.get(`${backendConfig.activitiesEndpoint}/` + uuid);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activitiesEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}

function newValue(answerDate, activity, valueAnswers) {
  const data = {
    id: uuid.v4(),
    activity: activity,
    valueAnswers: valueAnswers,
    answerDate: answerDate
  };

  if (backendConfig.apiUser) {
    console.log("machine - new value");
    return machineService.post(`${backendConfig.answerEndpoint}`, data);
  }
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.answerEndpoint}`,
    requestOptions.post(data)
  ).then(handleResponse);
}
