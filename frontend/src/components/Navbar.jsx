import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getToken, clearToken } from "../lib/api"; // Import getToken and clearToken

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken()); // Track login status

  // Function to handle logout
  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <nav className="bg-white shadow border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Brand Title */}
        <div className="font-semibold text-lg text-gray-900 leading-tight">
          Mukhyamantri Shram Shakti Yojna{" "}
          <br className="hidden sm:block" />
          <span className="text-sm text-gray-600">
            (मुख्यमंत्री श्रम शक्ति योजना) – Training Application Portal
          </span>
        </div>

        {/* Right cluster on desktop */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                className="text-gray-700 transition-colors"
                style={{
                  color: "#6b7280"
                }}
                onMouseEnter={(e) => e.target.style.color = "#372948"}
                onMouseLeave={(e) => e.target.style.color = "#6b7280"}
                to="/register"
              >
                Register
              </Link>
              <Link
                className="text-gray-700 transition-colors"
                style={{
                  color: "#6b7280"
                }}
                onMouseEnter={(e) => e.target.style.color = "#372948"}
                onMouseLeave={(e) => e.target.style.color = "#6b7280"}
                to="/login"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            // X (Close) icon
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden mt-3 border-t border-gray-200 pt-3">
          <div className="flex flex-col gap-2 text-sm font-medium">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false); // Close mobile menu after logout
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 w-full text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  className="text-gray-700 transition-colors py-2"
                  style={{
                    color: "#6b7280"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#372948"}
                  onMouseLeave={(e) => e.target.style.color = "#6b7280"}
                  to="/register"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
                <Link
                  className="text-gray-700 transition-colors py-2"
                  style={{
                    color: "#6b7280"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#372948"}
                  onMouseLeave={(e) => e.target.style.color = "#6b7280"}
                  to="/login"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}