import React, { useState } from "react";

export default function Login() {
  const params = new URLSearchParams(window.location?.search || "");
  const next = params.get("next") || "/dashboard";

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterMobile");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  // Mock API calls for demonstration
  const api = async (endpoint, options) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (endpoint === "/auth/login/send-otp") {
      return { username: "John Doe" };
    }
    if (endpoint === "/auth/verify-otp") {
      if (options.body.includes('"otp":"123456"')) {
        return { token: "mock-jwt-token" };
      }
      throw new Error("Invalid OTP");
    }
  };

  const setToken = (token) => {
    console.log("Token set:", token);
  };

  async function sendOtp() {
    setMessage("");
    setLoading(true);

    try {
      const resp = await api("/auth/login/send-otp", {
        method: "POST",
        body: JSON.stringify({ mobile }),
      });
      setMessageType("success");
      if (resp && resp.username) {
        setMessage(`Hello ${resp.username}. OTP sent via SMS.`);
      } else {
        setMessage("OTP sent via SMS.");
      }
      setStep("enterOtp");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setMessage("");
    setLoading(true);

    try {
      const data = await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ mobile, otp }),
      });
      setToken(data.token);
      setMessageType("success");
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        alert("Redirecting to dashboard...");
      }, 1200);
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

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === "enterMobile"
              ? "Sign in with your mobile number using OTP verification"
              : "Enter the OTP sent to your mobile"}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Step 1 */}
        {step === "enterMobile" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, sendOtp)}
                placeholder="Enter your mobile number"
                className="w-full rounded-lg border-0 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading || !mobile.trim()}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 font-semibold transition-all duration-200"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === "enterOtp" && (
          <div className="space-y-4">
            <div className="text-center p-2 bg-blue-50 rounded-lg text-sm text-blue-800">
              OTP sent to <span className="font-semibold">{mobile}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyPress={(e) => handleKeyPress(e, verifyOtp)}
                placeholder="6-digit OTP (try: 123456)"
                maxLength={6}
                className="w-full rounded-lg border-0 bg-gray-50 px-3 py-2 text-lg text-center tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={goBack}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 font-semibold transition-all duration-200"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}

        {/* Footer link */}
        <div className="mt-6 text-center">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); alert("Redirecting to register..."); }}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
          >
            New user? Register
          </a>
        </div>
      </div>
    </div>
  );
}