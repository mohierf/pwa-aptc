/*
 * Activities services
 */

import { backendConfig } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";

export const patientService = {
  getAll, getById
};

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
      `${backendConfig.apiUrl}${backendConfig.patientsEndpoint}`,
      requestOptions.get()
  ).then(handleResponse);
}


function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch(
      `${backendConfig.apiUrl}${backendConfig.patientsEndpoint}/${id}`,
      requestOptions.get()
  ).then(handleResponse);
}