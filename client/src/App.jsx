import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import React from "react";
import LoginPage from "./components/LoginPage";
import logo from './assets/logo.png'
import './App.css'

function App() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return <LoginPage onGoogleLogin={handleGoogleLogin} />;
}

export default App
