/*
 * Activities services
 */

import { backendConfig } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";

export const activityService = {
  getAll
};

function getAll() {
  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activitiesEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}
