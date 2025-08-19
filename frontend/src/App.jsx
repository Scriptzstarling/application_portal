import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ApplicationTracker from './pages/ApplicationTracker'
import ReviewApplication from './pages/ReviewApplication' // Import ReviewApplication
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tracker" element={<ApplicationTracker />} />
        <Route path="/view-application" element={<ReviewApplication />} /> {/* New route for viewing application */}
        <Route element={<ProtectedRoute /> }>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}


