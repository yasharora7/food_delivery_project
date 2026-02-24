import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppProvider } from './context/AppContext.tsx'
import "leaflet/dist/leaflet.css";

export const authService = "http://localhost:3000";
export const resturantService = "http://localhost:3001";
export const utilsService = "http://localhost:3002";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="">
      <AppProvider>
          <App />
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
