import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CRMProvider } from './context/CRMContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CRMProvider>
      <App />
    </CRMProvider>
  </StrictMode>,
)
