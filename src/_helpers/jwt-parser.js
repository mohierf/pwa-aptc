/*
 * Parse a JWT refresh token
 * -------------------------
 * Returns:
 * {
 *   roles: [ "ROLE_USER" ],
 *   username: "frederic.mohier@gmail.com",
 *   id: "6488adb6-6ac4-4c30-9530-d9cd343bcb2e",
 *   lastlogout: "2020-02-22T17:43:56+00:00",
 *   JWTIdentifier: "8a71989adf1f1aad459d52ee09cd6dac1aa1ebf6804643cdbb3bfb73e9dd0caf",
 *   iat: 1582693973,
 *   exp: 1582697573
 * }
 *
 * (exp - iat) is the number of seconds before token expiry.
 */
export function jwtParse(token) {
  const base64Url = token.split(".")[1] || null;
  if (!base64Url) {
    return null;
  }
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
