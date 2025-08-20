import React, { useState } from 'react';
import { CheckCircle, Clock, FileText, Phone, Eye } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function ApplicationTracker() {
  const location = useLocation();
  const navigate = useNavigate();
  const { applicationData = {}, status = 'Submitted' } = location.state || {};
  const [applicationStatus, setApplicationStatus] = useState(status);
  const stages = ['Submitted', 'District', 'SR', 'Final Approved'];

  const getStageIcon = (stage, isCompleted, isCurrent) => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-white" />;
    } else if (isCurrent) {
      return <Clock className="w-5 h-5 text-white" />;
    } else {
      return <div className="w-2 h-2 bg-white rounded-full" />;
    }
  };

  const currentStageIndex = stages.indexOf(applicationStatus);

  const handleViewApplication = () => {
    navigate('/view-application', { state: { applicationData } });
  };

  return (
    <div className="min-h-screen bg-[#372948]">
      {/* Small Header Box */}
      <div className="bg-white shadow-md border-b-4 border-[#372948]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-[#372948] text-center">
            Track your application status here
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Application Information Card */}
        <div className="bg-white rounded-lg shadow-xl mb-8 overflow-hidden">
          <div className="bg-[#372948] px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Application Details
            </h2>
            <button
              onClick={handleViewApplication}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Application
            </button>
          </div>
          
          <div className="p-6">
            {applicationData && Object.keys(applicationData).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#372948] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Application ID</p>
                    <p className="text-lg font-semibold text-gray-900">{applicationData.applicationId || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#372948] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Applicant Name</p>
                    <p className="text-lg font-semibold text-gray-900">{applicationData.applicantName || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#372948] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Father's Name</p>
                    <p className="text-lg font-semibold text-gray-900">{applicationData.fatherName || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#372948] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Mobile Number</p>
                    <p className="text-lg font-semibold text-gray-900">{applicationData.mobile || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#372948] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Application Date</p>
                    <p className="text-lg font-semibold text-gray-900">{applicationData.date || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#372948] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Status</p>
                    <p className="text-lg font-semibold text-green-600">{applicationStatus}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No application data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Progress Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#372948] px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center justify-between">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Application Progress
              </span>
              <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {applicationStatus}
              </span>
            </h2>
          </div>
          
          <div className="p-8">
            {/* Progress Bar */}
            <div className="relative mb-12">
              <div className="absolute inset-x-0 top-1/2 h-2 bg-gray-200 rounded-full -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 h-2 bg-[#372948] rounded-full -translate-y-1/2 transition-all duration-1000 ease-out"
                style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
              ></div>

              <div className="flex justify-between relative z-10">
                {stages.map((index, stage) => {
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  const isActive = index <= currentStageIndex;
                  
                  return (
                    <div key={stage} className="flex flex-col items-center">
                      <div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-500 shadow-lg border-4
                          ${isActive 
                            ? 'bg-[#372948] border-[#372948] transform scale-110' 
                            : 'bg-gray-300 border-gray-300'
                          }`
                        }
                      >
                        {getStageIcon(stage, isCompleted, isCurrent)}
                      </div>
                      
                      <div className="text-center max-w-24">
                        <span 
                          className={`text-sm font-semibold transition-colors duration-300 block mb-1
                            ${isActive ? 'text-[#372948]' : 'text-gray-500'}`}
                        >
                          {stage}
                        </span>
                        
                        {isCurrent && (
                          <div className="flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#372948] rounded-full animate-pulse"></div>
                            <span className="text-xs text-[#372948] ml-1 font-medium">In Progress</span>
                          </div>
                        )}
                        
                        {isCompleted && (
                          <span className="text-xs text-green-600 font-medium">Completed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Description */}
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#372948]">
              <h3 className="font-semibold text-[#372948] mb-2">Current Status: {applicationStatus}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {applicationStatus === 'Submitted' && "Your application has been successfully submitted and is awaiting initial review."}
                {applicationStatus === 'District' && "Your application is being processed at the district level. This may take 3-5 business days."}
                {applicationStatus === 'SR' && "Your application is under senior review. Final approval is pending."}
                {applicationStatus === 'Final Approved' && "Congratulations! Your application has been approved. You will receive confirmation shortly."}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-center space-x-6 text-center">
            <div className="flex items-center space-x-2 text-[#372948]">
              <Phone className="w-4 h-4" />
              <div>
                <p className="font-semibold">Helpdesk Support</p>
                <p className="text-sm text-gray-600">0612224975</p>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-[#372948]">
              <Clock className="w-4 h-4" />
              <div>
                <p className="font-semibold">Office Hours</p>
                <p className="text-sm text-gray-600">Mon-Fri: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationTracker;