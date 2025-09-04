import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Unblur from "./pages/Unblur"
import './index.css'

// Pages (relative imports)
import Landing from './pages/Landing'
import Memory from './pages/Memory'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Gallery from './pages/Gallery'   // <- matches Gallery.tsx
import Gift from './pages/Gift'         // <- matches Gift.tsx



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/unblur" element={<Unblur />} /> 
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gift" element={<Gift />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
