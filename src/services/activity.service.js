/*
 * Activities services
 */

import { backendConfig } from "../_helpers";
import { authHeader, handleResponse } from "../_helpers";

export const activityService = {
  getAll
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.activitiesEndpoint}`,
    requestOptions
  ).then(handleResponse);
}
