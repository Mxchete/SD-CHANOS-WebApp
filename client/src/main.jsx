import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import PotOverview from './components/OverviewPage';
import PlantPage from './components/PlantPage';
import AccountPage from './components/AccountPage'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/overview" element={<PotOverview />} />
      <Route path="/plant/:potID" element={<PlantPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  </BrowserRouter>
)
