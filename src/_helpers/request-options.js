import { readFromStorage } from "./local-storage";
import { backendConfig } from "../_helpers";

const CryptoJS = require("crypto-js");

export const requestOptions = {
    get(headers = {}) {
        return {
            method: 'GET',
            ...headers(headers = {})
        };
    },
    post(body) {
        return {
            method: 'POST',
            ...headers(),
            body: JSON.stringify(body)
        };
    },
    patch(body) {
        return {
            method: 'PATCH',
            ...headers(),
            body: JSON.stringify(body)
        };
    },
    put(body) {
        return {
            method: 'PUT',
            ...headers(),
            body: JSON.stringify(body)
        };
    },
    delete() {
        return {
            method: 'DELETE',
            ...headers()
        };
    }
};

function headers(headers={}, machine=false, url=null) {
    // Machine API - specific headers
    if (machine) {
        return machineHeaders(headers, url);
    }

    // Set authorization header with jwt access token
    const token = readFromStorage("access_token") || {};
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    return {
        headers: {
            ...headers,
            'Content-Type': 'application/ld+json'
        }
    }
}
export const makeHeaders = headers();

function machineHeaders(headers={}, url=null) {
    const timestamp = Math.floor(Date.now() / 1000);
    const endpoint =
        url.indexOf("?") !== -1 ? url.substring(0, url.indexOf("?")) : url;
    const signature = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA512(endpoint + timestamp, backendConfig.apiToken)
    );

    let buff = new Buffer(backendConfig.apiUser + ":" + signature);

    headers["x-auth-token"] = buff.toString("base64");

    return {
        headers: {
            ...headers,
            'Content-Type': 'application/ld+json'
        }
    }
}
