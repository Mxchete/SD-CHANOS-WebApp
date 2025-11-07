import React from "react";
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "../global.css";
import "./LoginPage.css";
import { loginWithGoogle } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const handleSuccess = async(credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    try {
      const result = await loginWithGoogle(credentialResponse.credential);

      if (result && result.success) {
        navigate(`/overview`);
      } else {
        console.error("Login response invalid:", result);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleError = async() => {
    console.error("Google login failed");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/logo.png" alt="C.H.A.N.O.S. Logo" className="login-logo" />
        <h1 className="login-title">C.H.A.N.O.S.</h1>
        <p className="login-subtitle">
          Sign in to continue using all features.
        </p>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%"
              logo_alignment="left"
              text="signin_with"
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

