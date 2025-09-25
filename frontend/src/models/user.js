// Centralized user model and parser for Google ID tokens
// Note: We intentionally ignore exp (expiration) checks per requirements.
import { jwtDecode } from "jwt-decode";

/**
 * @typedef {Object} User
 * @property {string} id         - Google subject (sub)
 * @property {string} name       - Full name
 * @property {string} [givenName]
 * @property {string} [familyName]
 * @property {string} email
 * @property {boolean} [emailVerified]
 * @property {string} picture    - Avatar URL
 * @property {number} [iat]      - Issued at (epoch seconds)
 * @property {number} [exp]      - Expiration (epoch seconds) — not validated here
 */

/**
 * Parse and normalize a Google ID token into our User shape.
 * Expiration is NOT validated.
 * @param {string} idToken
 * @returns {User}
 */
export function parseGoogleUserFromJwt(idToken) {
  const payload = jwtDecode(idToken);

  // Normalize common fields from Google ID token
  const user = {
    id: payload.sub,
    name: payload.name || `${payload.given_name ?? ""} ${payload.family_name ?? ""}`.trim(),
    givenName: payload.given_name,
    familyName: payload.family_name,
    email: payload.email,
    emailVerified: payload.email_verified,
    picture: payload.picture,
    iat: payload.iat,
    exp: payload.exp,
  };

  return user;
}
