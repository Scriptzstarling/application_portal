import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No application data to review. Please fill out the form first.</p>
      </div>
    );
  }
  
  function handleEdit() {
    // Navigate back to the dashboard, passing the form data back for editing
    navigate('/dashboard', { state: { formData } });
  }

  function handleFinalSubmit() {
    const isConfirmed = window.confirm("Are you sure you want to finally submit your application? You will not be able to edit it after this.");
    if (isConfirmed) {
      console.log("Submitting form:", formData);
      // Navigate to the tracker page with the application data
      navigate('/tracker', { state: { applicationData: formData, status: 'Submitted' } });
    }
  }

  // NOTE: The renderField, openFileInNewTab, and formatFieldName functions,
  // and the categories object remain unchanged. They are omitted here for brevity.

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
            {value && value instanceof File ? (
              <span 
                className="text-blue-600 underline cursor-pointer hover:text-blue-800 flex items-center gap-2"
                onClick={() => openFileInNewTab(value)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {value.name}
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

  // Function to open file in new tab
  function openFileInNewTab(file) {
    if (file && file instanceof File) {
      try {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank')?.focus();
        // It's good practice to revoke the URL, but give the browser a moment
        setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
      } catch (error) {
        console.error('Error opening file:', error);
        alert('Unable to open file. Please try again.');
      }
    }
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
    <div className="min-h-screen p-4 sm:p-6" style={{ backgroundColor: "#372948" }}>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Review Your Application
        </h2>
        
        <div className="mb-8 text-center">
          <p className="text-gray-600">Please review all details carefully before final submission.</p>
          <p className="text-sm text-gray-500 mt-1">Click on file names to view uploaded documents.</p>
        </div>

        {Object.entries(categories).map(([category, fields]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields
                .filter(field => formData[field] !== undefined && formData[field] !== null && formData[field] !== "")
                .map(field => renderField(field, formData[field]))
              }
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t">
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg
                    hover:bg-gray-200 transition-all duration-200 w-full sm:w-auto"
          >
            Edit Application
          </button>
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-3 bg-[#372948] text-white font-medium rounded-lg
                    hover:bg-[#4a325d] transition-all duration-200 w-full sm:w-auto"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;