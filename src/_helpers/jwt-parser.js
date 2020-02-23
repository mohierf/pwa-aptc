/*
 * Parse a JWT refresh token
 * -------------------------
 * Returns:
 * {
 *   sub: 265534,
 *   token_type: "refresh",
 *   exp: 1581790573,
 *   iat: 1579198573,
 *   jti: "22a43b1b0b694ceaa425f7b26c856960"
 * }
 *
 * exp - iat is the number of seconds before token expiry.
 */
export function jwtParse(token) {
  let base64Url = token.split(".")[1];
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
