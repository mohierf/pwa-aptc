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
// import {store} from "../_store";

export const mediaService = {
  getById,
  newMedia
};

function getById(uuid) {
  console.log("Media - getById", backendConfig.apiUser);
  if (backendConfig.apiUser) {
    // const url = `${backendConfig.mediaEndpoint}/${uuid}`;
    // return fetch(
    //   `${backendConfig.apiUrl}${url}`,
    //   requestOptions.get({}, true, url)
    // )
    //   .then(response => {
    //     return response.text().then(text => {
    //       console.log(response.headers)
    //       let data;
    //       try {
    //         // Response text should be json data!
    //         data = JSON.parse(text);
    //       } catch (e) {
    //         data = text;
    //       }
    //
    //       if (!response.ok) {
    //         // todo: Check what is the fail response pattern
    //         let error =
    //             (data && data.detail) || (data && data.message) || response.statusText;
    //         if (typeof error !== "string") {
    //           error = JSON.stringify(error);
    //         }
    //
    //         if (response.status === 401) {
    //           console.log("401")
    //           // Do not care if we are logging out, else we will indefinitely log out!
    //           if (
    //               response.url !==
    //               `${backendConfig.apiUrl}${backendConfig.logoutEndpoint}`
    //           ) {
    //             // auto logout if 401 response returned from api
    //             store.dispatch("user/logout", error);
    //             return Promise.reject(error);
    //           }
    //           return data;
    //         }
    //
    //         if (response.status === 403) {
    //           // store.dispatch("user/userDenied", error, { root: true }).then(() => {
    //           //   console.log("403!", error, response);
    //           // });
    //         }
    //
    //         return Promise.reject(error);
    //       }
    //
    //       return data;
    //     });
    //   })
    //   .then(body => {
    //     return body;
    //   })
    //   .catch(error => {
    //     console.log("Machine Get error:", error);
    //     // return error;
    //   });

    return machineService.get(`${backendConfig.mediaEndpoint}/${uuid}`);
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
    return machineService.postMedia(`${backendConfig.mediaAddEndpoint}`, data);
  }
  return fetch(`${backendConfig.apiUrl}${backendConfig.mediaAddEndpoint}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
      // Do not specify the content type, else it will fail!
      // "Content-type": "multipart/form-data"
    },
    body: data
  })
    .then(handleResponse)
    .then(response => {
      console.log("Yes!", response);
    });
}
