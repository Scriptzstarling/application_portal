import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, ArrowLeft } from 'lucide-react';

const ViewApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applicationData } = location.state || {};
  const pdfRef = useRef();

  if (!applicationData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#372948]">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">No application data found. Please go back.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-[#372948] text-white rounded-lg hover:bg-[#4a325d] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 15;
      pdf.setFontSize(16);
      pdf.text("Mukhyamantri Shram Shakti Yojna - Application", pdfWidth / 2, 10, { align: 'center' });
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`application-${applicationData.applicantName}.pdf`);
    });
  };
  
  // NOTE: The renderField, formatFieldName, and categories object are the same as in 
  // ReviewApplication.jsx and are omitted here for brevity. They should be included.
   // Function to show form fields in different ways
   function renderField(key, value) {
    // Check if this is a file field
    const isFileField = key.includes("Cert") || key.includes("marksheet") || 
                       key.includes("signature") || key.includes("photo");
    
    if (isFileField) {
      return (
        <div key={key} className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
          <span className="font-medium text-gray-700">{formatFieldName(key)}</span>
          <div className="mt-1">
            {value && value.name ? (
              <span className="text-gray-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {value.name} (Submitted)
              </span>
            ) : (
              <span className="text-red-500">No file attached</span>
            )}
          </div>
        </div>
      );
    }
    
    // Format boolean fields
    const isBooleanField = ["handicapped", "selfDeclaration", "domicileBihar"].includes(key);
    if (isBooleanField) {
      const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                          value === 'true' || value === 'Yes' ? 'Yes' : 'No';
      return (
        <div key={key} className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
          <span className="font-medium text-gray-700">{formatFieldName(key)}</span>
          <div className="mt-1 font-semibold text-gray-900">{displayValue}</div>
        </div>
      );
    }
    
    // Regular text fields
    return (
      <div key={key} className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
        <span className="font-medium text-gray-700">{formatFieldName(key)}</span>
        <div className="mt-1 font-semibold text-gray-900">{value || "N/A"}</div>
      </div>
    );
  }

  // Function to format field names for display
  function formatFieldName(fieldName) {
    const fieldNameMap = {
      incomeCert: 'Income Certificate',
      residentialCert: 'Residential Certificate',
      marksheet: 'Marksheet',
      signature: 'Signature',
      photo: 'Photo',
      applicantName: 'Applicant Name',
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      dob: 'Date of Birth',
      domicileBihar: 'Domicile of Bihar',
      choiceDistrict: 'Choice District',
      jobRoleChoice: 'Job Role Choice',
      selfDeclaration: 'Self Declaration',
      previousTraining: 'Previous Training',
      previousTrainingDetails: 'Previous Training Details'
    };
    return fieldNameMap[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').trim();
  }

  // Group fields into categories for structured display
  const categories = {
    "Personal Details": ["applicantName", "fatherName", "motherName", "dob", "religion", 
                        "gender", "handicapped", "disabilityDegree"],
    "Identity & Income": ["aadhar", "income", "nationality", "maritalStatus", "incomeCert"],
    "Contact Information": ["email", "mobile", "telephone"],
    "Residential Details": ["domicileBihar", "district", "address", "permanentAddress", 
                           "residentialCert"],
    "Application Details": ["choiceDistrict", "jobRoleChoice", "qualification", 
                           "marksheet", "previousTraining", "previousTrainingDetails"],
    "Declarations & Documents": ["signature", "photo", "selfDeclaration", "place", "date"]
  };

  return (
    <div className="min-h-screen bg-[#372948] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with buttons */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#372948] font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Tracker
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 bg-[#372948] text-white font-semibold rounded-lg shadow-md hover:bg-[#4a325d] transition-all"
          >
            <Download size={18} />
            Download as PDF
          </button>
        </div>

        {/* Application Form for Viewing */}
        <div ref={pdfRef} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Submitted Application
            </h2>
            <p className="text-gray-500 mt-2">
              This is a read-only view of your submitted application details.
            </p>
          </div>

          {Object.entries(categories).map(([category, fields]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-[#372948] mb-4 pb-2 border-b-2 border-[#372948]">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields
                  .filter(field => applicationData[field] !== undefined && applicationData[field] !== null && applicationData[field] !== "")
                  .map(field => renderField(field, applicationData[field]))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;