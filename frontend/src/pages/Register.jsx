import React, { useState } from "react";
import { api } from "../lib/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterMobile");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "success"

  async function sendOtp(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ mobile, username }),
      });
      setMessageType("success");
      setMessage("OTP sent via SMS.");
      setStep("enterOtp");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ mobile, otp, username }),
      });
      window.location.href = "/login";
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Register</h2>
        <p className="text-sm text-gray-500 mb-6">
          Create your account using mobile number & OTP verification.
        </p>

        {message && (
          <div
            className={`mb-4 text-sm ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {step === "enterMobile" && (
          <form onSubmit={sendOtp} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg bg-gray-100 px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile"
                className="w-full rounded-lg bg-gray-100 px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-900 hover:bg-blue-800 text-white py-2 font-medium transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === "enterOtp" && (
          <form onSubmit={verifyOtp} className="space-y-4 sm:space-y-5">
            <div className="text-sm text-gray-600">OTP sent to {mobile}</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-lg bg-gray-100 px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-900 hover:bg-blue-800 text-white py-2 font-medium transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-blue-900 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
