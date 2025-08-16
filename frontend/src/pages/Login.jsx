import React, { useState } from "react";
import { api } from "../lib/api";

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

  const setToken = (token) => {
    localStorage.setItem("authToken", token);
    console.log("Token set:", token);
  };

  async function sendOtp() {
    setMessage("");
    setLoading(true);

    if (!mobile || mobile.trim().length < 10) {
      setMessageType("error");
      setMessage("Please enter a valid mobile number");
      setLoading(false);
      return;
    }

    try {
      const response = await api("/auth/login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim() }),
      });

      setMessageType("success");
      if (response && response.username) {
        setUsername(response.username);
        setMessage(`Hello ${response.username}. OTP sent via SMS.`);
      } else {
        setMessage("OTP sent via SMS.");
      }
      setStep("enterOtp");
    } catch (err) {
      setMessageType("error");
      if (err.status === 404) {
        setMessage("User not found. Please register first.");
      } else if (err.status === 429) {
        setMessage("Too many requests. Please try again later.");
      } else {
        setMessage(err.message || "Failed to send OTP");
      }
      console.error("Send OTP Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setMessage("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setMessageType("error");
      setMessage("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await api("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim(), otp: otp.trim() }),
      });

      if (response && response.token) {
        setToken(response.token);
        setMessageType("success");
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = next;
        }, 1500);
      }
    } catch (err) {
      setMessageType("error");
      if (err.status === 400) {
        setMessage(err.message || "Invalid OTP");
      } else if (err.status === 410) {
        setMessage("OTP has expired. Please request a new one.");
        setStep("enterMobile");
      } else if (err.status === 429) {
        setMessage("Too many attempts. Please try again later.");
      } else {
        setMessage(err.message || "Login failed. Please try again.");
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
    setUsername("");
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") action();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(to bottom right, #372948, #241630)" }}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === "enterMobile"
              ? "Sign in with your mobile number"
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

        {/* Step 1: Enter Mobile */}
        {step === "enterMobile" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^\d+\-\s()]/g, "");
                  setMobile(cleaned);
                }}
                onKeyPress={(e) => handleKeyPress(e, sendOtp)}
                placeholder="Enter your mobile number"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white"
                style={{ borderColor: "#372948", outlineColor: "#5a3e70" }}
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
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#4a325d";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#5a3e70";
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP */}
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
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyPress={(e) => handleKeyPress(e, verifyOtp)}
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-lg text-center tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white"
                style={{ borderColor: "#372948", outlineColor: "#5a3e70" }}
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
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "#4a325d";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "#5a3e70";
                }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}

        {/* Footer link */}
        <div className="mt-6 text-center">
          <a
            href="/register"
            className="text-sm font-medium hover:underline"
            style={{ color: "#372948" }}
          >
            New user? Register
          </a>
        </div>
      </div>
    </div>
  );
}
