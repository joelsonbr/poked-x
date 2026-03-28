import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App' // Chame o App aqui!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> 
  </StrictMode>,
)