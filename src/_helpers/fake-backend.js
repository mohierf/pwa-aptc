import { backendConfig } from "../_helpers";
import { readFromStorage, writeToStorage } from "./local-storage";

// An array in the browser local storage for registered users
let usersList = readFromStorage("usersList") || [];
export const registeredUsers = usersList;

// An array in the browser local storage for patients
let patientsList = [
  {
    id: "712707",
    status: false,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: 8,
    name: "SOG174832CHFCCH S01",
    business: "HABITAT",
    status_level: 1,
    url: "https://demo.vizavy.fr/api/equipment/712707",
    status_label: "OK",
    brand: null,
    set_stop: false,
    last_log_timestamp: "2018-12-06T11:47:00",
    logs: "https://demo.vizavy.fr/api/equipment/712707/logs",
    location: "Salle de Bains RDC n°1",
    provider_name: "",
    category: 1,
    category_label: "Chauffage",
    type: "Chaudière murale",
    serial: "",
    building_name: "Rue Davout"
  },
  {
    id: "712711",
    status: true,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: null,
    name: "SOG174832CWCPCWCW01",
    business: "HABITAT",
    status_level: null,
    url: "https://demo.vizavy.fr/api/equipment/712711",
    status_label: "OK",
    brand: null,
    set_stop: null,
    last_log_timestamp: null,
    logs: "https://demo.vizavy.fr/api/equipment/712711/logs",
    location: "W.C.intérieur RDC n°1",
    provider_name: "",
    category: 4,
    category_label: "Plomberie",
    type: "Cuvette WC",
    serial: "",
    building_name: "Rue Davout"
  },
  {
    id: "712708",
    status: true,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: null,
    name: "SOG174832DOUPDOUS01",
    business: "HABITAT",
    status_level: null,
    url: "https://demo.vizavy.fr/api/equipment/712708",
    status_label: "OK",
    brand: null,
    set_stop: null,
    last_log_timestamp: null,
    logs: "https://demo.vizavy.fr/api/equipment/712708/logs",
    location: "Salle de Bains RDC n°1",
    provider_name: "",
    category: 4,
    category_label: "Plomberie",
    type: "Cabine de douche",
    serial: "",
    building_name: "Rue Davout"
  },
  {
    id: "712705",
    status: true,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: null,
    name: "SOG174832EVIPEVICUI",
    business: "HABITAT",
    status_level: null,
    url: "https://demo.vizavy.fr/api/equipment/712705",
    status_label: "OK",
    brand: null,
    set_stop: null,
    last_log_timestamp: null,
    logs: "https://demo.vizavy.fr/api/equipment/712705/logs",
    location: "Cuisine",
    provider_name: "",
    category: 4,
    category_label: "Plomberie",
    type: "Evier",
    serial: "",
    building_name: "Rue Davout"
  },
  {
    id: "712709",
    status: true,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: null,
    name: "SOG174832LAVPLAVS01",
    business: "HABITAT",
    status_level: null,
    url: "https://demo.vizavy.fr/api/equipment/712709",
    status_label: "OK",
    brand: null,
    set_stop: null,
    last_log_timestamp: null,
    logs: "https://demo.vizavy.fr/api/equipment/712709/logs",
    location: "Salle de Bains RDC n°1",
    provider_name: "",
    category: 4,
    category_label: "Plomberie",
    type: "Lavabo",
    serial: "",
    building_name: "Rue Davout"
  },
  {
    id: "712706",
    status: false,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: 5,
    name: "SOG174832XTRVXTRCUI",
    business: "HABITAT",
    status_level: 0,
    url: "https://demo.vizavy.fr/api/equipment/712706",
    status_label: "OK",
    brand: null,
    set_stop: false,
    last_log_timestamp: "2018-10-29T14:30:00",
    logs: "https://demo.vizavy.fr/api/equipment/712706/logs",
    location: "Cuisine",
    provider_name: "",
    category: 2,
    category_label: "Ventilation",
    type: "Extracteur d'air individuel",
    serial: "",
    building_name: "Rue Davout"
  },
  {
    id: "712710",
    status: true,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: 5,
    name: "SOG174832XTRVXTRS01",
    business: "HABITAT",
    status_level: 0,
    url: "https://demo.vizavy.fr/api/equipment/712710",
    status_label: "OK",
    brand: null,
    set_stop: false,
    last_log_timestamp: "2018-10-29T14:30:00",
    logs: "https://demo.vizavy.fr/api/equipment/712710/logs",
    location: "Salle de Bains RDC n°1",
    provider_name: "",
    category: 2,
    category_label: "Ventilation",
    type: "Extracteur d'air individuel",
    serial: "",
    building_name: "Rue Davout"
  },
  {
    id: "712712",
    status: true,
    building: "https://demo.vizavy.fr/api/building/119086",
    status_qualification: 5,
    name: "SOG174832XTRVXTRW01",
    business: "HABITAT",
    status_level: 0,
    url: "https://demo.vizavy.fr/api/equipment/712712",
    status_label: "OK",
    brand: null,
    set_stop: false,
    last_log_timestamp: "2018-10-29T14:30:00",
    logs: "https://demo.vizavy.fr/api/equipment/712712/logs",
    location: "W.C.intérieur RDC n°1",
    provider_name: "",
    category: 2,
    category_label: "Ventilation",
    type: "Extracteur d'air individuel",
    serial: "",
    building_name: "Rue Davout"
  }
];

// An array in the browser local storage for equipments
let logsList = [
  {
    id: 733606,
    equipment: "https://demo.vizavy.fr/api/equipment/712707",
    level: "D\u00e9faut",
    caller: "CHAYN HAMID",
    timestamp: "2018-12-06T11:47:00+01:00",
    delivery_timestamp: "2018-12-06T11:47:00",
    arrival_timestamp: null,
    departure: "2018-12-12T17:39:00",
    end_timestamp: "2018-12-12T17:39:00+01:00",
    estimated_end_timestamp: "2018-12-08T08:00:00",
    customer_description: "PB DE CHAUFFAGE PERSISTANT",
    trapped_passengers: false,
    diagnosis: "",
    action: "",
    part: null,
    maintenance: "ISERBA NORD",
    technician: "",
    technician_comment: "",
    qualification: "Appel client",
    set_out_of_service: false,
    rating: null,
    qualification_raw: 8,
    level_raw: 1,
    request_number: "NTE18211614",
    order_number: null,
    priority: 2,
    cust_convenience: false
  },
  {
    id: 733604,
    equipment: "https://demo.vizavy.fr/api/equipment/712707",
    level: "Panne",
    caller: "CHAYN HAMID",
    timestamp: "2018-12-06T11:47:00+01:00",
    delivery_timestamp: "2018-12-06T11:47:00",
    arrival_timestamp: "2018-12-12T15:58:00+01:00",
    departure: "2018-12-12T17:39:00",
    end_timestamp: "2018-12-12T17:39:00+01:00",
    estimated_end_timestamp: "2018-12-12T14:00:00",
    customer_description:
      "corps de chauffe urgent EN ATELIER HORAIRE SCOLAIRE SVP   08 12PB DE CHAUFFAGE PERSISTANT",
    trapped_passengers: false,
    diagnosis: "D\u00e9faillance technique",
    action: "V\u00e9rification / Essais",
    part: "Corps de chauffe",
    maintenance: "ISERBA NORD",
    technician: "SPRIE",
    technician_comment: "changement cdc plus sonde chauffage OK",
    qualification: "D\u00e9faillance technique",
    set_out_of_service: false,
    rating: null,
    qualification_raw: 0,
    level_raw: 3,
    request_number: "NTE18211614",
    order_number: "NTE18211614/002",
    priority: 2,
    cust_convenience: false
  },
  {
    id: 733605,
    equipment: "https://demo.vizavy.fr/api/equipment/712707",
    level: "Panne",
    caller: "CHAYN HAMID",
    timestamp: "2018-12-06T11:47:00+01:00",
    delivery_timestamp: "2018-12-06T11:47:00",
    arrival_timestamp: "2018-12-08T11:23:00+01:00",
    departure: "2018-12-08T12:09:00",
    end_timestamp: "2018-12-12T17:39:00+01:00",
    estimated_end_timestamp: "2018-12-12T14:00:00",
    customer_description:
      "corps de chauffe urgent EN ATELIER HORAIRE SCOLAIRE SVP   08 12PB DE CHAUFFAGE PERSISTANT",
    trapped_passengers: false,
    diagnosis:
      "gonflage vase pr\u00e9voir corps de chauffe urgent, d\u00e9tartrage installation pose radiateur \u00e9lectrique   RAPI pas de pot \u00e0 boue",
    action: "",
    part: "Vase d'expansion",
    maintenance: "ISERBA NORD",
    technician: "BCARL",
    technician_comment:
      "gonflage vase pr\u00e9voir corps de chauffe urgent, d\u00e9tartrage installation pose radiateur \u00e9lectrique   RAPI pas de pot \u00e0 boue",
    qualification: "D\u00e9faillance technique",
    set_out_of_service: false,
    rating: null,
    qualification_raw: 0,
    level_raw: 3,
    request_number: "NTE18211614",
    order_number: "NTE18211614/001",
    priority: 2,
    cust_convenience: false
  },
  {
    id: 733615,
    equipment: "https://demo.vizavy.fr/api/equipment/712712",
    level: "Entretien",
    caller: "CHAYN HAMID",
    timestamp: "2018-10-29T14:30:00+01:00",
    delivery_timestamp: "2018-10-29T14:30:00",
    arrival_timestamp: "2018-11-20T13:24:00+01:00",
    departure: "2018-11-20T14:03:00",
    end_timestamp: "2018-11-22T15:34:00+01:00",
    estimated_end_timestamp: "2018-11-22T14:00:00",
    customer_description:
      "pr\u00e9voir demenbouage urgents  20 11PANNE RADIATEUR MAIS CHAUDIERE FONCTIONNE VOIR POUR LES CHANGER     ATTENTION AUX HORAIRES SCOLAIRE",
    trapped_passengers: false,
    diagnosis: "Visite d'entretien",
    action: "V\u00e9rification / Essais",
    part: "Corps de chauffe, radiateur logement",
    maintenance: "ISERBA NORD",
    technician: "BGHYS",
    technician_comment:
      "ve-2018pr\u00e9voir demenbouage urgents radiateur chauffe pas salon salle a manger cuisine . pas de flitre a boue sous la chaudi\u00e8re",
    qualification: "Entretien",
    set_out_of_service: false,
    rating: null,
    qualification_raw: 5,
    level_raw: 0,
    request_number: "NTE18123544",
    order_number: "NTE18123544/001",
    priority: 4,
    cust_convenience: true
  }
];

export function configureFakeBackend() {
  let realFetch = window.fetch;

  window.fetch = function(url, opts) {
    return new Promise((resolve, reject) => {
      // wrap in timeout to simulate server api call
      setTimeout(() => {
        // register a new user
        if (
          url.endsWith(`${backendConfig.registerEndpoint}`) &&
          opts.method === "POST"
        ) {
          // get new user object from post body
          let newUser = JSON.parse(opts.body);

          // validation
          let duplicateUser = usersList.filter(user => {
            return user.username === newUser.username;
          }).length;
          if (duplicateUser) {
            reject("users.ko_register");
            return;
          }

          // save new user
          newUser.id = usersList.length
            ? Math.max(...usersList.map(user => user.id)) + 1
            : 1;
          newUser.password = newUser.lastName;
          usersList.push(newUser);
          writeToStorage("usersList", usersList);

          // respond 200 OK
          resolve({ ok: true, text: () => Promise.resolve() });

          return;
        }

        // authenticate a user
        if (
          url.endsWith(`${backendConfig.loginEndpoint}`) &&
          opts.method === "POST"
        ) {
          // get parameters from post request
          let params = JSON.parse(opts.body);

          // find if any user matches login credentials
          let filteredUsers = usersList.filter(user => {
            return (
              user.username === params.username &&
              user.password === params.password
            );
          });

          if (filteredUsers.length) {
            // if login details are valid return user details and fake jwt token
            let user = filteredUsers[0];
            let responseJson = {
              token: "fake-jwt-token-" + user.id
            };
            resolve({
              ok: true,
              text: () => Promise.resolve(JSON.stringify(responseJson))
            });
          } else {
            // else return error
            reject("users.ko_login");
          }

          return;
        }

        // get connected user profile data
        if (
          url.endsWith(`${backendConfig.profileEndpoint}`) &&
          opts.method === "GET"
        ) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (opts.headers && opts.headers.Authorization.startsWith("Token")) {
            // Get the logged-in user identifier (fake backend behaviour!)
            let userId = opts.headers.Authorization.replace(
              "Token fake-jwt-token-",
              ""
            );

            // find if any user matches login credentials
            let filteredUsers = usersList.filter(found => {
              return found.id === parseInt(userId);
            });
            if (filteredUsers.length) {
              let found = filteredUsers[0];
              let role = "tenant";

              let layout = null;
              try {
                layout = require("../assets/layout-" +
                  found.lastName +
                  ".json");
              } catch (e) {
                try {
                  layout = require("../assets/layout-" + role + ".json");
                } catch (e) {
                  layout = null;
                }
              }

              let responseJson = {
                role: role,
                firstName: found.firstName,
                lastName: found.lastName,
                layout: layout
              };

              resolve({
                ok: true,
                text: () => Promise.resolve(JSON.stringify(responseJson))
              });
            } else {
              reject("NotFound");
            }
          } else {
            // return 401 not authorised if token is null or invalid
            reject("Unauthorised");
          }

          return;
        }

        // get equipments
        if (
          url.endsWith(`${backendConfig.patientsEndpoint}`) &&
          opts.method === "GET"
        ) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (opts.headers && opts.headers.Authorization.startsWith("Token")) {
            resolve({
              ok: true,
              text: () => Promise.resolve(JSON.stringify(patientsList))
            });
          } else {
            // return 401 not authorised if token is null or invalid
            reject("Unauthorised");
          }

          return;
        }

        // get logs
        if (
          url.endsWith(`${backendConfig.logsEndpoint}`) &&
          opts.method === "GET"
        ) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (opts.headers && opts.headers.Authorization.startsWith("Token")) {
            resolve({
              ok: true,
              text: () => Promise.resolve(JSON.stringify(logsList))
            });
          } else {
            // return 401 not authorised if token is null or invalid
            reject("Unauthorised");
          }

          return;
        }

        // get users
        if (url.endsWith("/users") && opts.method === "GET") {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (opts.headers && opts.headers.Authorization.startsWith("Token")) {
            resolve({
              ok: true,
              text: () => Promise.resolve(JSON.stringify(usersList))
            });
          } else {
            // return 401 not authorised if token is null or invalid
            reject("Unauthorised");
          }

          return;
        }

        // get user by id
        if (url.match(/\/users\/\d+$/) && opts.method === "GET") {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (opts.headers && opts.headers.Authorization.startsWith("Token")) {
            // find user by id in users array
            let urlParts = url.split("/");
            let id = parseInt(urlParts[urlParts.length - 1]);
            let matchedUsers = usersList.filter(user => {
              return user.id === id;
            });
            let user = matchedUsers.length ? matchedUsers[0] : null;

            // respond 200 OK with user
            resolve({ ok: true, text: () => JSON.stringify(user) });
          } else {
            // return 401 not authorised if token is null or invalid
            reject("Unauthorised");
          }

          return;
        }

        // delete user
        if (url.match(/\/users\/\d+$/) && opts.method === "DELETE") {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (opts.headers && opts.headers.Authorization.startsWith("Token")) {
            // find user by id in users array
            let urlParts = url.split("/");
            let id = parseInt(urlParts[urlParts.length - 1]);
            for (let i = 0; i < usersList.length; i++) {
              let user = usersList[i];
              if (user.id === id) {
                // delete user
                usersList.splice(i, 1);
                localStorage.setItem("usersList", JSON.stringify(usersList));
                break;
              }
            }

            // respond 200 OK
            resolve({ ok: true, text: () => Promise.resolve() });
          } else {
            // return 401 not authorised if token is null or invalid
            reject("Unauthorised");
          }

          return;
        }

        // pass through any requests not handled above
        realFetch(url, opts).then(response => resolve(response));
      }, 1000);
    });
  };
}
