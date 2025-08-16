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

    if (!mobile || mobile.trim().length < 10) {
      setMessageType("error");
      setMessage("Please enter a valid mobile number");
      setLoading(false);
      return;
    }

    const requestBody = {
      mobile: mobile.trim(),
      username: mobile.trim(),
    };

    try {
      await api("/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      setMessageType("success");
      setMessage("OTP sent via SMS.");
      setStep("enterOtp");
    } catch (err) {
      setMessageType("error");
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

    if (!otp || otp.length !== 6) {
      setMessageType("error");
      setMessage("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    const requestBody = {
      mobile: mobile.trim(),
      otp: otp.trim(),
      username: mobile.trim(),
    };

    try {
      await api("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      setMessageType("success");
      setMessage("Registration successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setMessageType("error");
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
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6"
         style={{ background: "linear-gradient(to bottom right, #372948, #241630)" }}>
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
                  const cleaned = e.target.value.replace(/[^\d+\-\s()]/g, "");
                  setMobile(cleaned);
                }}
                placeholder="Enter your mobile number"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white"
                style={{ borderColor: "#372948", focusRingColor: "#372948" }}
                autoComplete="tel"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !mobile.trim()}
              className="w-full rounded-lg text-white py-2 text-sm sm:text-base font-semibold transition-colors"
              style={{
                backgroundColor: loading ? "#9e8fb2" : "#372948",
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === "enterOtp" && (
          <form onSubmit={verifyOtp} className="space-y-3">
            <div
              className="text-center p-2 rounded-lg text-xs sm:text-sm font-medium"
              style={{ backgroundColor: "#f2ecf8", color: "#372948" }}
            >
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
                className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-lg text-center tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white"
                style={{ borderColor: "#372948" }}
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
                className="w-full rounded-lg text-white py-2 text-sm sm:text-base font-semibold transition-colors disabled:opacity-60"
                style={{
                  backgroundColor: loading ? "#9e8fb2" : "#372948",
                }}
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
            className="text-xs sm:text-sm font-medium"
            style={{ color: "#372948" }}
          >
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
