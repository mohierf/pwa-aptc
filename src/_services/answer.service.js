/*
 * Values services
 */

import {
  backendConfig,
  requestOptions,
  handleResponse,
  readFromStorage
} from "../_helpers";
import { machineService } from "../_services";
import { uuid } from "vue-uuid";

export const answerService = {
  getAllActivitiesAnswers,
  getAllValuesAnswers,
  getActivityAnswerById,
  newValue
};

function getAllActivitiesAnswers(parameters) {
  const my_id = readFromStorage("user_id");
  const my_patient = my_id ? `patient=${my_id}` : "";
  const my_activity = parameters.activityId
    ? `&activity=${parameters.activityId}`
    : "";
  // todo: no sort possible on answerDate ... use receiptDate!
  // const sort = "&order[answerDate]=DESC";
  const sort = "&order[receiptDate]=DESC";
  const pagination =
    parameters.itemsCount > 0
      ? `&pagination=true&pageSize=${parameters.itemsCount}`
      : "";
  if (backendConfig.apiUser) {
    return machineService.get(
      `${backendConfig.activityAnswerEndpoint}?${my_patient}${my_activity}${sort}${pagination}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activityAnswerEndpoint}?${my_patient}${my_activity}${sort}${pagination}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getAllValuesAnswers(parameters) {
  const my_id = readFromStorage("user_id");
  const my_patient = my_id ? `patient=${my_id}` : "";
  const my_value = parameters.valueId ? `&value.id=${parameters.valueId}` : "";
  // todo: no sort possible on answerDate ... use receiptDate!
  // const sort = "&order[answerDate]=DESC";
  const sort = parameters.sort ? `&order[receiptDate]=${parameters.sort}` : "";
  const pagination =
    parameters.itemsCount > 0
      ? `&pagination=true&pageSize=${parameters.itemsCount}`
      : "";
  if (backendConfig.apiUser) {
    return machineService.get(
      `${backendConfig.valueAnswerEndpoint}?${my_patient}${my_value}${sort}${pagination}`
    );
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.valueAnswerEndpoint}?${my_patient}${my_value}${sort}${pagination}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getActivityAnswerById(uuid) {
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
  const my_iri = readFromStorage("user_iri");
  const data = JSON.stringify({
    id: uuid.v4(),
    patient: my_iri,
    activity: activity,
    valueAnswers: valueAnswers,
    answerDate: answerDate
  });

  if (backendConfig.apiUser) {
    return machineService.post(`${backendConfig.activityAnswerEndpoint}`, data);
  }
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activityAnswerEndpoint}`,
    requestOptions.post(data)
  ).then(handleResponse);
}
