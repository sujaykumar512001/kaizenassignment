import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ClaimForm from './pages/ClaimForm'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import SuccessPage from './pages/SuccessPage'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="App">
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/claim-form" element={<ClaimForm />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App 