/*
 * Values services
 */

import {backendConfig, requestOptions, handleResponse, readFromStorage} from "../_helpers";
import { machineService } from "../_services";
import { uuid } from "vue-uuid";

export const valueService = {
  getById,
  newValue
};

function getById(uuid) {
  console.log("Value - getById", backendConfig.apiUser);
  if (backendConfig.apiUser) {
    return machineService.get(`${backendConfig.activitiesEndpoint}/` + uuid);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activitiesEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}

function newValue(answerDate, activity, valueAnswers) {
  const my_iri = readFromStorage("user_iri");
  const data = JSON.stringify({
    id: uuid.v4(),
    patient: my_iri,
    activity: activity,
    valueAnswers: valueAnswers,
    answerDate: answerDate
  });
  console.log(data);

  if (backendConfig.apiUser) {
    console.log("machine - new value");
    return machineService.post(`${backendConfig.activityAnswerEndpoint}`, data);
  }
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activityAnswerEndpoint}`,
    requestOptions.post(data)
  ).then(handleResponse);
}
