import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { parseGoogleUserFromJwt, type User } from '../models/user'

export interface LoginButtonProps {
  onLogin?: (user: User) => void
  themeMode?: 'light' | 'dark'
}

export const LoginButton = ({ onLogin, themeMode = 'light' }: LoginButtonProps) => {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential
    if (!token) return
    const userObject = parseGoogleUserFromJwt(token)
    console.log('User Data:', userObject)

    if (typeof onLogin === 'function') {
      onLogin(userObject)
    }
  }

  const handleError = () => {
    console.error('Login Failed')
  }

  // Map our app theme to Google button theme; options: outline | filled_blue | filled_black
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  )
}
