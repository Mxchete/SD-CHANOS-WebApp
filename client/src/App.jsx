import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png'
import './App.css'

function App() {
  const navigate = useNavigate();

  const getStarted = () => {
    navigate('/overview');
  };

  return (
    <>
      <div>
        <a target="_blank">
          <img src={logo} className="CHANOS logo" alt="CHANOS logo" />
        </a>
      </div>
      <h1>C.H.A.N.O.S.</h1>
      <p>
        Controlled Hydration Automated Nutrient Optimization System
      </p>
      <div className="card">
        <button onClick={() => getStarted()}>
          Get Started!
        </button>
      </div>
    </>
  )
}

export default App
