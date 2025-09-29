import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { parseGoogleUserFromJwt, type User } from '../models/user'
import { azureAuthService } from '../services/azure-auth'
import { env } from '../config/env'

export interface LoginButtonProps {
  onLogin?: (user: User) => void
  themeMode?: 'light' | 'dark'
}

export const LoginButton = ({ onLogin, themeMode = 'light' }: LoginButtonProps) => {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential
    if (!token) {
      console.error('❌ No credential token received from Google')
      return
    }
    
    const userObject = parseGoogleUserFromJwt(token)
    console.log('✅ Google authentication successful - User Data:', userObject)

    try {
      // Store Google user data for session persistence
      try {
        localStorage.setItem('google_user_data', JSON.stringify(userObject))
        console.log('💾 Google user data stored for session persistence')
      } catch (storageError) {
        console.warn('⚠️ Could not store Google user data:', storageError)
      }

      // Authenticate with Azure Easy Auth using the Google ID token
      const azureResponse = await azureAuthService.authenticateWithGoogle(token)
      console.log('🎉 Complete authentication flow successful!')
      console.log('📝 Azure Auth Response:', azureResponse)
      
      // Optionally get additional user info from Azure
      try {
        const azureUserInfo = await azureAuthService.getMe()
        console.log('👤 Azure user info:', azureUserInfo)
      } catch (error) {
        console.warn('⚠️ Could not fetch Azure user info:', error)
      }

      if (typeof onLogin === 'function') {
        onLogin(userObject)
      }
    } catch (error) {
      console.error('❌ Azure authentication failed:', error)
      
      // Log additional debugging information
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      
      // If it's an HTTP error, log the response details
      if (error && typeof error === 'object' && 'status' in error) {
        console.error('HTTP Status:', (error as any).status)
        console.error('Response body:', (error as any).body)
      }
      
      console.log('🔍 Debugging info:')
      console.log('- Google ID token (first 50 chars):', token.substring(0, 50) + '...')
      console.log('- API URL:', `${env.API_URL}/.auth/login/google`)
      
      // You might want to show an error message to the user here
      // For now, we'll still call onLogin with the Google user data
      if (typeof onLogin === 'function') {
        onLogin(userObject)
      }
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
