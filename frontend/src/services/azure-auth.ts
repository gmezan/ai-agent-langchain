import { env } from '../config/env'
import { http, setAzureAuthToken } from '../utils/http'

export interface AzureAuthResponse {
  authenticationToken: string
  user: {
    userId: string // Format: "sid:..."
  }
}

const AZURE_TOKEN_KEY = 'azure_auth_token'
const AZURE_USER_KEY = 'azure_user_info'
const GOOGLE_USER_KEY = 'google_user_data'

export const azureAuthService = {
  /**
   * Authenticate with Azure Easy Auth using Google ID token
   * @param googleIdToken - The Google ID token received from Google OAuth
   * @returns Promise with Azure authentication response
   */
  async authenticateWithGoogle(googleIdToken: string): Promise<AzureAuthResponse> {
    console.log('🔄 Authenticating with Azure Easy Auth using Google token...')
    
    try {
      const response = await http<AzureAuthResponse>(`${env.API_URL}/.auth/login/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: googleIdToken
        }),
      })

      console.log('✅ Azure authentication successful:', response)
      
      // Store the authentication token for future API calls
      if (response.authenticationToken) {
        setAzureAuthToken(response.authenticationToken)
        
        // Persist token and user info to localStorage for session persistence
        try {
          localStorage.setItem(AZURE_TOKEN_KEY, response.authenticationToken)
          localStorage.setItem(AZURE_USER_KEY, JSON.stringify(response.user))
          console.log('🔑 Azure auth token stored for future API calls (will use X-ZUMO-AUTH header)')
          console.log('💾 Session persisted to localStorage')
        } catch (error) {
          console.warn('⚠️ Could not persist session to localStorage:', error)
        }
        
        console.log('👤 Azure user ID:', response.user.userId)
      }
      
      return response
    } catch (error) {
      console.error('❌ Azure authentication failed:', error)
      throw error
    }
  },

  /**
   * Get current authentication status from Azure
   */
  async getMe(): Promise<any> {
    try {
      const response = await http(`${env.API_URL}/.auth/me`)
      console.log('👤 Azure user info:', response)
      return response
    } catch (error) {
      console.error('❌ Failed to get Azure user info:', error)
      throw error
    }
  },

  /**
   * Restore session from localStorage if available
   */
  restoreSession(): { token: string; user: any; googleUser: any } | null {
    try {
      const token = localStorage.getItem(AZURE_TOKEN_KEY)
      const userStr = localStorage.getItem(AZURE_USER_KEY)
      const googleUserStr = localStorage.getItem(GOOGLE_USER_KEY)
      
      if (token && userStr) {
        const user = JSON.parse(userStr)
        const googleUser = googleUserStr ? JSON.parse(googleUserStr) : null
        setAzureAuthToken(token)
        console.log('🔄 Session restored from localStorage')
        console.log('👤 Restored Azure user:', user.userId)
        if (googleUser) {
          console.log('👤 Restored Google user:', googleUser.name)
        }
        return { token, user, googleUser }
      }
    } catch (error) {
      console.warn('⚠️ Could not restore session from localStorage:', error)
      this.clearStoredSession()
    }
    return null
  },

  /**
   * Clear stored session data
   */
  clearStoredSession(): void {
    try {
      localStorage.removeItem(AZURE_TOKEN_KEY)
      localStorage.removeItem(AZURE_USER_KEY)
      localStorage.removeItem(GOOGLE_USER_KEY)
      setAzureAuthToken(null)
      console.log('🧹 Stored session cleared')
    } catch (error) {
      console.warn('⚠️ Could not clear stored session:', error)
    }
  },

  /**
   * Check if current session is still valid by calling Azure's /.auth/me
   */
  async validateSession(): Promise<boolean> {
    try {
      await this.getMe()
      console.log('✅ Session is still valid')
      return true
    } catch (error) {
      console.log('❌ Session is invalid or expired')
      this.clearStoredSession()
      return false
    }
  },

  /**
   * Logout from Azure Easy Auth
   */
  async logout(): Promise<void> {
    try {
      await http(`${env.API_URL}/.auth/logout`, {
        method: 'GET'
      })
      console.log('✅ Azure logout successful')
    } catch (error) {
      console.error('❌ Azure logout failed:', error)
    } finally {
      // Always clear stored session data
      this.clearStoredSession()
    }
  }
}