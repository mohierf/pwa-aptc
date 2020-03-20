/*
 * Daily messages services
 */

import { backendConfig } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
// import { machineService } from "../_services";

export const dailyMessageService = {
  getAll
};

function getAll() {
  // if (backendConfig.apiUser) {
  //   return machineService.get(`${backendConfig.dailyMessagesEndpoint}`);
  // }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.dailyMessagesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}
