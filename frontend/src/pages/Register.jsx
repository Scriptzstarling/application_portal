import React, { useState } from "react";

export default function Register() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Register
        </h2>

        {/* Mobile Input */}
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
            placeholder="Enter your mobile number"
            className="w-full rounded-lg border border-[#372948] bg-gray-50 px-3 py-2 text-sm 
                       placeholder-gray-400 focus:outline-none focus:border-[#5a3e70] focus:bg-white"
            autoComplete="tel"
            required
          />
        </div>

        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="6-digit OTP"
            maxLength={6}
            className="w-full rounded-lg border border-[#372948] bg-gray-50 px-3 py-2 text-lg text-center 
                       tracking-widest placeholder-gray-400 focus:outline-none focus:border-[#5a3e70] focus:bg-white"
            autoComplete="one-time-code"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-lg bg-[#372948] px-4 py-2 text-white font-semibold 
                     hover:bg-[#5a3e70] transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
