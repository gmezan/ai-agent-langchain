import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { parseGoogleUserFromJwt, type User } from '../models/user'

export const LoginButton = ({ onLogin }: { onLogin?: (user: User) => void }) => {
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

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
}
