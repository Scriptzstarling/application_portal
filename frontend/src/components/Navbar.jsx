import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken, clearToken } from '../lib/api';

export default function Navbar() {
  const [me, setMe] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setMe(null);
      return;
    }
    api('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  function logout() {
    clearToken();
    window.location.href = '/login';
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="font-semibold text-lg text-gray-900">OTP App Portal</div>
        {/* Right cluster on desktop */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link className="text-gray-700 hover:text-blue-700 transition" to="/">Register</Link>
          <Link className="text-gray-700 hover:text-blue-700 transition" to="/login">Login</Link>
          <Link className="text-gray-700 hover:text-blue-700 transition" to="/dashboard">Dashboard</Link>
          <div className="text-sm">
            {me ? (
              <span className="flex items-center gap-3">
                Hi, <span className="font-medium text-gray-900">{me.username || me.mobile}</span>
                <button onClick={logout} className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1 rounded-lg transition">Logout</button>
              </span>
            ) : (
              <span className="opacity-70 text-gray-500">Not signed in</span>
            )}
          </div>
        </div>
        {/* Mobile menu button */}
        <button
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden mt-3 border-t border-gray-200 pt-3 space-y-3">
          <div className="flex flex-col gap-2 text-sm font-medium">
            <Link className="text-gray-700 hover:text-blue-700 transition" to="/" onClick={() => setOpen(false)}>Register</Link>
            <Link className="text-gray-700 hover:text-blue-700 transition" to="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link className="text-gray-700 hover:text-blue-700 transition" to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
          </div>
          <div className="text-sm pt-2">
            {me ? (
              <div className="flex items-center justify-between">
                <span>Hi, <span className="font-medium text-gray-900">{me.username || me.mobile}</span></span>
                <button onClick={logout} className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1 rounded-lg transition">Logout</button>
              </div>
            ) : (
              <span className="opacity-70 text-gray-500">Not signed in</span>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
