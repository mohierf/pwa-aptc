/*
 * Media services
 */

import {
  backendConfig,
  requestOptions,
  handleResponse,
  readFromStorage
} from "../_helpers";
import { machineService } from "../_services";
import { uuid } from "vue-uuid";

export const mediaService = {
  getById,
  newMedia
};

function getById(uuid) {
  console.log("Media - getById", backendConfig.apiUser);
  if (backendConfig.apiUser) {
    return machineService.get(`${backendConfig.mediaEndpoint}/` + uuid);
  }

  return fetch(
    `${backendConfig.apiUrl}${backendConfig.mediaEndpoint}/${uuid}`,
    requestOptions.get()
  ).then(handleResponse);
}

function newMedia(picture) {
  const my_id = readFromStorage("user_id");
  const data = new FormData();
  data.append("id", uuid.v4());
  data.append("userId", my_id);
  data.append("file", picture, "logo.png");

  const token = readFromStorage("access_token") || {};

  if (backendConfig.apiUser) {
    console.log("machine post media");
    return machineService.postMedia(`${backendConfig.mediaEndpoint}`, data);
  }
  return fetch(`${backendConfig.apiUrl}${backendConfig.mediaEndpoint}`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      // Do not specify the content type, else it will fail!
      // "Content-type": "multipart/form-data"
    },
    body: data
  })
  .then(handleResponse)
  .then(response => {
    console.log("Yes!", response)
  });
}
