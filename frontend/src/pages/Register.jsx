import React, { useState } from "react";
import { api } from "../lib/api";

export default function Register() {
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
    
    // Validate mobile number
    if (!mobile || mobile.trim().length < 10) {
      setMessageType("error");
      setMessage("Please enter a valid mobile number");
      setLoading(false);
      return;
    }
    
    const requestBody = {
      mobile: mobile.trim(),
      username: mobile.trim(), // Use mobile as username
    };
    
    console.log("Sending request body:", requestBody); // Debug log
    
    try {
      const response = await api("/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      setMessageType("success");
      setMessage("OTP sent via SMS.");
      setStep("enterOtp");
    } catch (err) {
      setMessageType("error");
      // More detailed error handling
      if (err.status === 400) {
        setMessage(err.message || "Invalid mobile number format");
      } else if (err.status === 429) {
        setMessage("Too many requests. Please try again later.");
      } else {
        setMessage(err.message || "Failed to send OTP. Please try again.");
      }
      console.error("Send OTP Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    // Validate OTP
    if (!otp || otp.length !== 6) {
      setMessageType("error");
      setMessage("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }
    
    const requestBody = {
      mobile: mobile.trim(), 
      otp: otp.trim(),
      username: mobile.trim(), // Use mobile as username
    };
    
    console.log("Verifying with request body:", requestBody); // Debug log
    
    try {
      const response = await api("/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      // Successful verification
      setMessageType("success");
      setMessage("Registration successful! Redirecting...");
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (err) {
      setMessageType("error");
      // More detailed error handling
      if (err.status === 400) {
        setMessage(err.message || "Invalid OTP or mobile number");
      } else if (err.status === 410) {
        setMessage("OTP has expired. Please request a new one.");
        setStep("enterMobile");
      } else if (err.status === 429) {
        setMessage("Too many attempts. Please try again later.");
      } else {
        setMessage(err.message || "Invalid OTP. Please try again.");
      }
      console.error("Verify OTP Error:", err);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3 sm:px-4 py-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm p-5 sm:p-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">
            Register
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Create your account with mobile number
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-2.5 rounded-lg text-xs sm:text-sm text-center font-medium ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Step 1: Enter Mobile */}
        {step === "enterMobile" && (
          <form onSubmit={sendOtp} className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  // Allow only numbers, +, -, spaces, and parentheses
                  const cleaned = e.target.value.replace(/[^\d+\-\s()]/g, '');
                  setMobile(cleaned);
                }}
                placeholder="Enter your mobile number"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                autoComplete="tel"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !mobile.trim()}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 text-sm sm:text-base font-semibold transition-colors"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === "enterOtp" && (
          <form onSubmit={verifyOtp} className="space-y-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-800">
              OTP sent to <span className="font-semibold">{mobile}</span>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-lg text-center tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                autoComplete="one-time-code"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={goBack}
                className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 text-sm sm:text-base font-semibold transition-colors"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-5 text-center">
          <a
            href="/login"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}