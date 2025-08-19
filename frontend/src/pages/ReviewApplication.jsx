import React from "react";

const ReviewApplication = ({ formData, onSubmit, isViewOnly = false }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
        
        {/* Header */}
        {isViewOnly && (
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Submitted Application
          </h2>
        )}

        {/* Info Card */}
        <div className="space-y-4 text-gray-700">
          {Object.entries(formData).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 hover:bg-gray-100 transition"
            >
              <span className="capitalize font-medium text-gray-600">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-gray-900 font-semibold">{value}</span>
            </div>
          ))}
        </div>

        {/* Submit button (only if not view-only) */}
        {!isViewOnly && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onSubmit}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
            >
              Confirm & Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewApplication;
