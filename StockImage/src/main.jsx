import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

    <BrowserRouter>
    <Toaster
     position="top-center"
     reverseOrder={false}
     />
    <App />
    </BrowserRouter>
     </AuthProvider>
  </StrictMode>,
)
