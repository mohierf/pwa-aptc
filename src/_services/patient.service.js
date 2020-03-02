/*
 * Patients services
 */

import { backendConfig } from "../_helpers";
import { requestOptions, handleResponse } from "../_helpers";
import { machineService } from "../_services";

export const patientService = {
  getAll,
  getById
};

function getAll() {
  if (backendConfig.apiUser) {
    return machineService.get(`${backendConfig.patientsEndpoint}`);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.patientsEndpoint}`,
    requestOptions.get()
  ).then(handleResponse);
}

function getById(uuid) {
  console.log(backendConfig.apiUser);
  if (backendConfig.apiUser) {
    return machineService.get(`${backendConfig.patientsEndpoint}/` + uuid);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.patientsEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}
