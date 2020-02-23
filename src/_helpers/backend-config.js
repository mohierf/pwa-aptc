export const backendConfig = {
  apiUrl: process.env.VUE_APP_API_ROOT,

  // User service
  loginEndpoint: "/patient_login_check",
  refreshEndpoint: "/token/refresh",
  profileEndpoint: "/me/user_info",

  // registerEndpoint: process.env.VUE_APP_API_ALLOW_REGISTER && "/user/register",
  // recoverEndpoint:
  //   process.env.VUE_APP_API_ALLOW_LOST_PASSWORD && "/user/recover",
  //
  logoutEndpoint: "/me/logout",
  touEndpoint: "/me/accept_conditions",

  // API service
  apiInfoEndpoint: "/api/info",

  // Patients health events service
  phesEndpoint: "/patient_health_events",

  // Other services
  activitiesEndpoint: "/free_activities",

  // Allowed users roles
  allowedRoles: ["patient"]
};

if (backendConfig.apiUrl === undefined) {
  console.warn(
    "No URI defined for the API! Set the environment variable VUE_APP_API_ROOT"
  );
}
