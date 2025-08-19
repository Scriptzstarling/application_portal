import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ApplicationTracker() {
  const location = useLocation();
  const { applicationData, status } = location.state || {};
  const [applicationStatus, setApplicationStatus] = useState(status || 'Submitted'); 
  const stages = ['Submitted', 'District', 'SR', 'Final Approved'];

  useEffect(() => {
    if (status) {
      setApplicationStatus(status);
    }
  }, [status]);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-[#372948]">
      <div className="max-w-5xl mx-auto my-6 sm:my-10 bg-white rounded-2xl shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23372948' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative z-10">
          {/* Small heading instead of big title */}
          <h2 className="text-xl font-semibold mb-8 text-gray-800">
            Check your application status here
          </h2>
          
          {/* Application details (smaller + left aligned) */}
          <div className="max-w-md p-6 rounded-xl border shadow-md mb-12"
               style={{ 
                 background: "linear-gradient(135deg, #f8f7fa 0%, #f3f0f7 100%)",
                 border: "2px solid #e5e3e8"
               }}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Your Application Details
            </h3>
            {applicationData ? (
              <div className="space-y-3 text-base">
                <p className="text-gray-700">👤 Applicant Name: <span className="font-medium">{applicationData.applicantName || 'N/A'}</span></p>
                <p className="text-gray-700">👨‍👩‍👦 Father's Name: <span className="font-medium">{applicationData.fatherName || 'N/A'}</span></p>
                <p className="text-gray-700">📱 Mobile Number: <span className="font-medium">{applicationData.mobile || 'N/A'}</span></p>
                <p className="text-gray-700">📅 Application Date: <span className="font-medium">{applicationData.date || 'N/A'}</span></p>
              </div>
            ) : (
              <p className="text-gray-700">No application data available.</p>
            )}
          </div>

          {/* Progress Tracker */}
          <div className="relative mb-12">
            <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 h-1 bg-[#4a325d] -translate-y-1/2 transition-all duration-500 ease-in-out"
              style={{ width: `${(stages.indexOf(applicationStatus) / (stages.length - 1)) * 100}%` }}
            ></div>

            <div className="flex justify-between text-center relative z-10">
              {stages.map((stage, index) => (
                <div key={stage} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 transition-colors duration-300
                      ${
                        index <= stages.indexOf(applicationStatus) 
                          ? 'bg-[#4a325d]' 
                          : 'bg-gray-400'
                      }`
                    }
                  >
                    {index + 1}
                  </div>
                  <span 
                    className={`text-sm font-medium transition-colors duration-300
                      ${
                        index <= stages.indexOf(applicationStatus) 
                          ? 'text-[#372948]' 
                          : 'text-gray-600'
                      }`
                    }
                  >
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600 bg-gray-50 inline-block px-6 py-3 rounded-full shadow">
              📞 Helpdesk: 0612224975
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ApplicationTracker;
