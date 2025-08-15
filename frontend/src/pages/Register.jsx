import React, { useState } from "react";
import { api } from "../lib/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterMobile");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  async function sendOtp(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
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
      setMessage(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ mobile, otp, username }),
      });
      window.location.href = "/login";
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  const goBack = () => {
    setStep("enterMobile");
    setOtp("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full max-w-xs sm:max-w-sm p-4 sm:p-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Register
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Create your account using mobile number & OTP verification.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-xs sm:text-sm text-center font-medium ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Step 1: Enter Mobile & Username */}
        {step === "enterMobile" && (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg border-0 bg-gray-50 px-3 py-2.5 sm:py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full rounded-lg border-0 bg-gray-50 px-3 py-2.5 sm:py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !mobile.trim() || !username.trim()}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === "enterOtp" && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-800">
              OTP sent to <span className="font-semibold">{mobile}</span>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Enter OTP
              </label>
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full rounded-lg border-0 bg-gray-50 px-3 py-2.5 sm:py-3 text-lg sm:text-xl text-center tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goBack}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2.5 text-sm sm:text-base font-semibold transition-all duration-200"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
          >
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
