import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@fortawesome/fontawesome-free/css/all.css'
import './styles/mdz-theme.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Quita la pantalla de arranque de la app instalada: deja ver la animación al menos ~1,4 s y la saca con fade
const splash = document.getElementById('splash')
if (splash) {
  const desde = (window as unknown as { __splashDesde?: number }).__splashDesde ?? Date.now()
  const espera = Math.max(0, 1400 - (Date.now() - desde))
  window.setTimeout(() => {
    splash.classList.add('is-hiding')
    window.setTimeout(() => splash.remove(), 600)
  }, espera)
}
