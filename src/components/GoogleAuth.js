import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = () => {
  const handleSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    // Handle successful login
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="google-auth">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleAuth;