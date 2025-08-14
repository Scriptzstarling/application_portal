import React, { useState } from "react";
import { api, setToken } from "../lib/api";

export default function Login() {
  const params = new URLSearchParams(location.search)
  const required = params.get('required')
  const next = params.get('next') || '/dashboard'
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterMobile");
  const [message, setMessage] = useState("");

  async function sendOtp(e) {
    e.preventDefault();
    setMessage("");
    try {
      const resp = await api("/auth/login/send-otp", {
        method: "POST",
        body: JSON.stringify({ mobile }),
      });
      if (resp && resp.username)
        setMessage(`Hello ${resp.username}. OTP sent via SMS.`);
      else setMessage("OTP sent via SMS.");
      setStep("enterOtp");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ mobile, otp }),
      });
      setToken(data.token);
       window.location.href = next;
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Login</h2>
          {required && (
            <div className="mb-3 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded p-2">
              Please register or login first to continue.
            </div>
          )}
        <p className="text-sm text-gray-500 mb-6">
          Sign in with your mobile number using OTP verification.
        </p>

        {message && (
          <div className="mb-4 text-sm text-red-600">{message}</div>
        )}

         {step === "enterMobile" && (
           <form onSubmit={sendOtp} className="space-y-4 sm:space-y-5">
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
            <div className="text-sm text-gray-600">
              OTP sent to {mobile}
            </div>
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
          <a href="/" className="text-sm text-blue-900 hover:underline">
            New user? Register
          </a>
        </div>
      </div>
    </div>
  );
}
