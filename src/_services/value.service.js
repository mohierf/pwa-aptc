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

export const valueService = {
  // getById,
  newValue
};

// function getById(uuid) {
//   console.log("Value - getById", backendConfig.apiUser);
//   if (backendConfig.apiUser) {
//     return machineService.get(`${backendConfig.activitiesEndpoint}/` + uuid);
//   }
//
//   return fetch(
//     `${backendConfig.apiUrl}${backendConfig.activitiesEndpoint}/${uuid}`,
//     requestOptions.get()
//   ).then(handleResponse);
// }
//
function newValue(answerDate, activity, valueAnswers) {
  const my_id = readFromStorage("user_id");
  // const patient = `patient=${my_id}`;
  // const activity = `activity=${activityId}`;
  //
  const data = JSON.stringify({
    id: uuid.v4(),
    activity: activity,
    patient: `/patients/${my_id}`,
    valueAnswers: valueAnswers,
    answerDate: answerDate
  });

  if (backendConfig.apiUser) {
    console.log("machine - new value");
    return machineService
      .post(`${backendConfig.activityAnswerEndpoint}`, data)
      .then(handleResponse)
      .then(response => {
        return response;
      });
  }
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activityAnswerEndpoint}`,
    requestOptions.post(data)
  ).then(handleResponse);
}
