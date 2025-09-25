import { jwtDecode } from 'jwt-decode'

export type User = {
  id: string
  name: string
  givenName?: string
  familyName?: string
  email: string
  emailVerified?: boolean
  picture: string
  iat?: number
  exp?: number
}

// The shape of Google's ID token payload (partial)
type GoogleIdTokenPayload = {
  sub: string
  name?: string
  given_name?: string
  family_name?: string
  email: string
  email_verified?: boolean
  picture: string
  iat?: number
  exp?: number
}

export function parseGoogleUserFromJwt(idToken: string): User {
  const payload = jwtDecode<GoogleIdTokenPayload>(idToken)

  return {
    id: payload.sub,
    name: payload.name || `${payload.given_name ?? ''} ${payload.family_name ?? ''}`.trim(),
    givenName: payload.given_name,
    familyName: payload.family_name,
    email: payload.email,
    emailVerified: payload.email_verified,
    picture: payload.picture,
    iat: payload.iat,
    exp: payload.exp,
  }
}
