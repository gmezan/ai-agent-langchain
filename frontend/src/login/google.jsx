import { GoogleLogin } from '@react-oauth/google';
import { parseGoogleUserFromJwt } from "../models/user";

export const LoginButton = ({ onLogin }) => {
  // This function runs after a successful login
  const handleSuccess = (credentialResponse) => {
    // The credential is a JWT token containing user info
    const token = credentialResponse.credential;
  const userObject = parseGoogleUserFromJwt(token); // Decode to normalized user
    
    // Notify parent with decoded user data if provided
    if (typeof onLogin === 'function') {
      onLogin(userObject);
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};