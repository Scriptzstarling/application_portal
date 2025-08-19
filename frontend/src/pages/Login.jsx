import React, { useState } from "react";
import { Link } from "react-router-dom"; 

export default function Login() {
  const params = new URLSearchParams(window.location?.search || "");
  const next = params.get("next") || "/dashboard";

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterMobile");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  function setToken(token) {
    localStorage.setItem("token", token);
    console.log("Token set:", token);
  }

  function sendOtp() {
    setMessage("");
    setLoading(true);

    const demoNumber = "1234567890"; 

    if (!mobile || mobile.trim().length < 10) {
      setMessageType("error");
      setMessage("Please enter a valid mobile number");
      setLoading(false);
      return;
    }

    if (mobile.trim() === demoNumber) {
      setToken("demo-token-123"); 
      setMessageType("success");
      setMessage("Demo login successful! Redirecting...");
      setLoading(false);
      setTimeout(function() {
        window.location.href = next;
      }, 1000);
      return; 
    }

    setMessageType("error");
    setMessage("Backend is not running. Only demo login (1234567890) is available.");
    setLoading(false);
    setStep("enterMobile"); 
    return; 
  }

  function verifyOtp() {
    setMessage("");
    setLoading(true);

    setMessageType("error");
    setMessage("OTP verification requires a running backend. Only demo login (1234567890) is available.");
    setLoading(false);
    return; 
  }

  function goBack() {
    setStep("enterMobile");
    setOtp("");
    setMessage("");
    setUsername("");
  }

  function handleEnterKey(e, action) {
    if (e.key === "Enter") {
      action();
    }
  }

  function handleMobileChange(e) {
    const value = e.target.value.replace(/[^\d+\-\s()]/g, "");
    setMobile(value);
  }

  function handleOtpChange(e) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  }

  function handleButtonHover(e) {
    if (!loading) {
      e.currentTarget.style.backgroundColor = "#4a325d";
    }
  }

  function handleButtonLeave(e) {
    if (!loading) {
      e.currentTarget.style.backgroundColor = "#5a3e70";
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(to bottom right, #372948, #241630)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === "enterMobile"
              ? "Sign in with your mobile number"
              : "Enter the OTP sent to your mobile"}
          </p>
        </div>

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

        {step === "enterMobile" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={handleMobileChange}
                onKeyPress={(e) => handleEnterKey(e, sendOtp)}
                placeholder="Enter your mobile number"
                className="w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-[#5a3e70] focus:border-[#5a3e70]"
                autoComplete="tel"
                required
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading || !mobile.trim()}
              className="w-full rounded-lg text-white py-2 font-semibold transition-colors"
              style={{
                backgroundColor: loading ? "#372948" : "#5a3e70",
              }}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === "enterOtp" && (
          <div className="space-y-4">
            <div
              className="text-center p-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "#f2ecf8", color: "#372948" }}
            >
              OTP sent to <span className="font-semibold">{mobile}</span>
              {username && (
                <div className="mt-1 text-xs">
                  Welcome back,{" "}
                  <span className="font-semibold">{username}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                onKeyPress={(e) => handleEnterKey(e, verifyOtp)}
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full rounded-lg border px-3 py-2 text-lg text-center tracking-widest placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-[#5a3e70] focus:border-[#5a3e70]"
                autoComplete="one-time-code"
                required
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
                className="flex-1 rounded-lg text-white py-2 font-semibold transition-colors disabled:opacity-60"
                style={{
                  backgroundColor: loading ? "#372948" : "#5a3e70",
                }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-sm font-medium hover:underline"
            style={{ color: "#372948" }}
          >
            New user? Register
          </Link>
        </div>
      </div>
    </div>
  );
}