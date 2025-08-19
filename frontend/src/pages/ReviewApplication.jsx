import React from "react";

function ReviewApplication({ formData, onEdit, onFinalSubmit }) {
  
  // Function to show form fields in different ways
  function renderField(key, value) {
    // Check if this is a file field
    const isFileField = key.includes("Cert") || key.includes("marksheet") || key.includes("signature") || key.includes("photo");
    
    if (isFileField) {
      return (
        <p key={key} className="text-gray-700 mb-1">
          <strong className="text-gray-900 capitalize">{formatFieldName(key)}:</strong>{" "}
          {value ? (
            <span className="text-green-600">File attached</span>
          ) : (
            <span className="text-red-600">No file attached</span>
          )}
        </p>
      );
    }
    
    // Check if this is a yes/no field
    const isBooleanField = key === "handicapped" || key === "selfDeclaration" || key === "domicileBihar";
    
    if (isBooleanField) {
      let displayValue = "No";
      if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else if (value === 'true') {
        displayValue = 'Yes';
      }
      
      return (
        <p key={key} className="text-gray-700 mb-1">
          <strong className="text-gray-900 capitalize">{formatFieldName(key)}:</strong>{" "}
          {displayValue}
        </p>
      );
    }
    
    // Regular text field
    return (
      <p key={key} className="text-gray-700 mb-1">
        <strong className="text-gray-900 capitalize">{formatFieldName(key)}:</strong> {String(value || "N/A")}
      </p>
    );
  }

  // Function to make field names look better
  function formatFieldName(fieldName) {
    return fieldName.replace(/([A-Z])/g, ' $1').trim();
  }

  // Group fields by category
  const categories = {
    "Personal Details": ["applicantName", "fatherName", "motherName", "dob", "religion", "gender", "handicapped", "disabilityDegree", "aadhar", "income", "nationality", "maritalStatus", "email", "mobile", "telephone"],
    "Residential Details": ["domicileBihar", "district", "address", "permanentAddress", "residentialCert"],
    "Application Choices": ["choiceDistrict", "jobRoleChoice", "qualification", "marksheet", "previousTraining", "previousTrainingDetails"],
    "Declarations & Attachments": ["incomeCert", "signature", "photo", "selfDeclaration", "place", "date"]
  };

  function handleSubmitButtonHover(e) {
    e.target.style.backgroundColor = "#372948";
  }

  function handleSubmitButtonLeave(e) {
    e.target.style.backgroundColor = "#4a325d";
  }

  return (
    <div className="max-w-5xl mx-auto my-6 sm:my-10 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Review Your Application</h2>
      <p className="text-center text-gray-600 mb-8">Please review your application details carefully before final submission.</p>

      {Object.entries(categories).map(function([categoryName, keys]) {
        return (
          <div key={categoryName} className="mb-8 border-b pb-4 last:border-b-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{categoryName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keys.map(function(key) {
                if (formData[key] !== undefined) {
                  return renderField(key, formData[key]);
                }
                return null;
              })}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={onEdit}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-200"
        >
          Edit Application
        </button>
        <button
          onClick={onFinalSubmit}
          style={{ backgroundColor: "#4a325d" }}
          className="hover:bg-opacity-80 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-200"
          onMouseEnter={handleSubmitButtonHover}
          onMouseLeave={handleSubmitButtonLeave}
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  );
}

export default ReviewApplication;