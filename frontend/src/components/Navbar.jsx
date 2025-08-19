import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getToken, clearToken } from "../lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  
  // Check if user is logged in
  const token = getToken();
  const isLoggedIn = !!token;
  const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn);

  function handleLogout() {
    clearToken();
    setUserLoggedIn(false);
    window.location.href = "/login";
  }

  function toggleMobileMenu() {
    setOpen(!open);
  }

  function handleDesktopRegisterHover(e) {
    e.target.style.color = "#372948";
  }

  function handleDesktopRegisterLeave(e) {
    e.target.style.color = "#6b7280";
  }

  function handleDesktopLoginHover(e) {
    e.target.style.color = "#372948";
  }

  function handleDesktopLoginLeave(e) {
    e.target.style.color = "#6b7280";
  }

  function handleMobileRegisterHover(e) {
    e.target.style.color = "#372948";
  }

  function handleMobileRegisterLeave(e) {
    e.target.style.color = "#1f2937";
  }

  function handleMobileLoginHover(e) {
    e.target.style.color = "#372948";
  }

  function handleMobileLoginLeave(e) {
    e.target.style.color = "#1f2937";
  }

  function handleMobileLogout() {
    handleLogout();
    setOpen(false);
  }

  return (
    <nav className="bg-white shadow border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg text-gray-900 leading-tight">
          Mukhyamantri Shram Shakti Yojna{" "}
          <br className="hidden sm:block" />
          <span className="text-sm text-gray-600">
            (मुख्यमंत्री श्रम शक्ति योजना) – Training Application Portal
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          {userLoggedIn ? (
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
                onMouseEnter={handleDesktopRegisterHover}
                onMouseLeave={handleDesktopRegisterLeave}
                to="/register"
              >
                Register
              </Link>
              <Link
                className="text-gray-700 transition-colors"
                style={{
                  color: "#6b7280"
                }}
                onMouseEnter={handleDesktopLoginHover}
                onMouseLeave={handleDesktopLoginLeave}
                to="/login"
              >
                Login
              </Link>
            </>
          )}
        </div>

        <button
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
          onClick={toggleMobileMenu}
        >
          {open ? (
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

      {open && (
        <div className="sm:hidden mt-3 border-t border-gray-200 pt-3">
          <div className="flex flex-col gap-2 text-sm font-medium">
            {userLoggedIn ? (
              <button
                onClick={handleMobileLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 w-full text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  className="text-gray-800 text-base font-semibold transition-colors"
                  onMouseEnter={handleMobileRegisterHover}
                  onMouseLeave={handleMobileRegisterLeave}
                  to="/register"
                >
                  Register
                </Link>
                <Link
                  className="text-gray-800 text-base font-semibold transition-colors"
                  onMouseEnter={handleMobileLoginHover}
                  onMouseLeave={handleMobileLoginLeave}
                  to="/login"
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