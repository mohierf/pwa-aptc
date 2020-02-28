/*
 * Standard handle of the API response
 */
import { backendConfig } from "../_helpers";
import { store } from "../_store";

export function handleResponse(response) {
  return response.text().then(text => {
    let data;
    try {
      // Response text should be json data!
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      // todo: Check what is the fail response pattern
      let error =
        (data && data.detail) || (data && data.message) || response.statusText;
      if (typeof error !== "string") {
        error = JSON.stringify(error);
      }

      if ([401, 403].indexOf(response.status) !== -1) {
        // Do not care if we are logging out, else we will indefinitely log out!
        if (
          response.url !==
          `${backendConfig.apiUrl}${backendConfig.logoutEndpoint}`
        ) {
          // auto logout if 401 response returned from api
          return store.dispatch("user/logout", error);
        }
        return data;
      }

      return Promise.reject(error);
    }

    return data;
  });
}
