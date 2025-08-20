import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ApplicationTracker from './pages/ApplicationTracker'
import ReviewApplication from './pages/ReviewApplication'
import ViewApplication from './pages/ViewApplication' // 1. Import the new ViewApplication component
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
        
      
        <Route path="/review" element={<ReviewApplication />} /> {/* 2. Add the missing /review route */}
        <Route path="/view-application" element={<ViewApplication />} /> {/* 3. Use the correct component here */}
        
        <Route element={<ProtectedRoute /> }>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}