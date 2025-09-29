# Azure Easy Auth Integration Guide

## Overview
This implementation adds Azure Easy Auth integration to your React frontend. After successful Google OAuth authentication, the app will automatically authenticate with your Azure Function App using the Google ID token.

## Flow
1. **Google OAuth**: User clicks login → Google OAuth flow → receives Google ID token
2. **Azure Auth**: App sends Google ID token to Azure Easy Auth endpoint
3. **Session Storage**: Both Azure auth token and Google user data stored in localStorage
4. **API Calls**: All future API calls include the Azure auth token
5. **Session Restoration**: On page refresh/reload, session is automatically restored if valid

## Files Modified

### 1. `/src/services/azure-auth.ts` (NEW)
- **Purpose**: Handles Azure Easy Auth API calls
- **Key Functions**:
  - `authenticateWithGoogle()`: Sends Google ID token to Azure
  - `getMe()`: Gets current Azure user info
  - `logout()`: Logs out from Azure Easy Auth

### 2. `/src/login/google.tsx` (MODIFIED)
- **Changes**: Added Azure authentication after successful Google login
- **Flow**: Google success → Parse user → Store Google data → Azure auth → Store token → Callback
- **Session**: Stores Google user data in localStorage for session persistence

### 3. `/src/utils/http.ts` (MODIFIED)
- **Changes**: Added automatic Azure auth token handling
- **Features**: 
  - Stores Azure auth token globally
  - Automatically adds `Authorization: Bearer <token>` header to API calls

### 4. `/src/App.tsx` (MODIFIED)
- **Changes**: Added Azure logout when user logs out + session restoration on app startup
- **Features**: 
  - Automatic session restoration on page load
  - Loading state while checking session
  - Clean logout from both Google and Azure
  - Session validation before restoration

## Environment Variables
Create `.env.local` file:
```env
VITE_API_URL=https://your-azure-function-app.azurewebsites.net
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Azure Easy Auth Endpoint
The implementation calls:
```
POST ${VITE_API_URL}/.auth/login/google
Content-Type: application/json
{
  "id_token": "<google-id-token>"
}
```

## Expected Azure Response
```json
{
  "authenticationToken": "eyJ...",
  "user": {
    "userId": "sid:123456789abcdef..."
  }
}
```

## Debugging

### Console Logs
The implementation includes extensive console logging:
- `✅ Google authentication successful`
- `🔄 Authenticating with Azure Easy Auth using Google token...`
- `✅ Azure authentication successful`
- `🔑 Azure auth token stored for future API calls`
- `👤 Azure user info: ...`

### Common Issues

1. **CORS Errors**
   - Ensure Azure Function App CORS settings allow your frontend origin
   - Check Azure Function App → Settings → CORS

2. **Azure Easy Auth Not Configured**
   - Verify Google provider is set up in Azure Function App
   - Check Azure Function App → Authentication → Identity providers

3. **Wrong API URL**
   - Ensure `VITE_API_URL` points to your Azure Function App
   - Should NOT include `.azurewebsites.net/.auth/login/google`
   - Should be just `https://your-app.azurewebsites.net`

4. **Google Client ID Issues**
   - Verify `VITE_GOOGLE_CLIENT_ID` matches your Google OAuth app
   - Check authorized origins include your localhost and domain

### Testing Steps
1. Open browser DevTools → Console
2. Click login button
3. Complete Google OAuth
4. Watch console logs for the authentication flow
5. Check Network tab for Azure auth request/response

### Network Request Details
Look for this request in DevTools:
```
POST https://your-app.azurewebsites.net/.auth/login/google
Request Headers:
  Content-Type: application/json
Request Body:
  {"id_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

## Future API Calls
After successful Azure authentication, all API calls to your Azure Function will automatically include:
```
X-ZUMO-AUTH: <azure-auth-token>
```

This is the correct header format for Azure Easy Auth. This token will be used by Azure Easy Auth to validate the user's session.

## Session Persistence 🔄

The implementation now includes automatic session persistence:

### What Gets Stored
- **Azure auth token**: Used for API authentication
- **Azure user info**: Basic user data from Azure Easy Auth
- **Google user data**: Complete user profile (name, email, picture, etc.)

### Storage Locations
- `localStorage.azure_auth_token`: The X-ZUMO-AUTH token
- `localStorage.azure_user_info`: Azure user data
- `localStorage.google_user_data`: Google user profile

### Session Restoration Flow
1. **App startup**: Check localStorage for existing session
2. **Token validation**: Call `/.auth/me` to verify token is still valid
3. **User restoration**: Restore complete Google user profile
4. **Auto-login**: User is automatically logged in if session is valid

### Session Management
- **Login**: Both Azure and Google data stored automatically
- **Logout**: All stored data cleared from localStorage
- **Expiration**: Invalid sessions are automatically cleared

### Benefits
- ✅ **No re-login** required on page refresh
- ✅ **Survives browser restart** (localStorage persists)
- ✅ **Automatic cleanup** of expired sessions
- ✅ **Complete user data** restoration
- ✅ **Production ready** for real applications

### Example API Call
```javascript
// This will automatically include the X-ZUMO-AUTH header
const response = await http(`${env.API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' }),
})
```

---

## 📚 Important Azure Documentation References

### Core Authentication Documentation
- **[Authentication and authorization in Azure App Service and Azure Functions](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization#authentication-flow)**
  - Official Microsoft documentation on Azure Easy Auth flow
  - Explains the complete authentication process and architecture
  - Essential reading for understanding how Azure Easy Auth works under the hood

- **[Customize sign-ins and sign-outs in Azure App Service authentication](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-customize-sign-in-out)**
  - Detailed guide on customizing the authentication experience
  - Covers redirect URLs, custom login pages, and logout behavior
  - Important for implementing production-ready authentication flows

### Additional Resources
- [Azure App Service Authentication REST API](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-how-to)
- [Google OAuth 2.0 Integration](https://docs.microsoft.com/en-us/azure/app-service/configure-authentication-provider-google)
- [Security Best Practices for Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/security-recommendations)

---

*This implementation guide provides a working authentication solution, but for production environments, please review the **SECURITY_ENHANCEMENT_ROADMAP.md** for additional security measures and best practices.*