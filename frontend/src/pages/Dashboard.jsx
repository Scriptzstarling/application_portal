import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// NOTE: The steps and biharDistricts arrays, and the renderStepContent, Field, 
// Select, RadioGroup, TextArea, and FileField components remain unchanged.
// They are omitted here for brevity but should be kept in your file.

const steps = [
  { id: 'personal', label: "Personal Information<br/>व्यक्तिगत जानकारी" },
  { id: 'additional', label: "Additional Details<br/>अतिरिक्त विवरण" },
  { id: 'contact', label: "Contact & Address<br/>संपर्क और पता" },
  { id: 'education', label: "Education & Training<br/>शिक्षा और प्रशिक्षण" },
  { id: 'uploads', label: "Uploads & Declaration<br/>अपलोड और घोषणा" },
];

const biharDistricts = [
  { v: "", l: "Select District" },
  { v: "Araria", l: "Araria" },
  { v: "Arwal", l: "Arwal" },
  { v: "Aurangabad", l: "Aurangabad" },
  { v: "Banka", l: "Banka" },
  { v: "Begusarai", l: "Begusarai" },
  { v: "Bhagalpur", l: "Bhagalpur" },
  { v: "Bhojpur", l: "Bhojpur" },
  { v: "Buxar", l: "Buxar" },
  { v: "Darbhanga", l: "Darbhanga" },
  { v: "East Champaran", l: "East Champaran" },
  { v: "Gaya", l: "Gaya" },
  { v: "Gopalganj", l: "Gopalganj" },
  { v: "Jamui", l: "Jamui" },
  { v: "Jehanabad", l: "Jehanabad" },
  { v: "Kaimur", l: "Kaimur" },
  { v: "Katihar", l: "Katihar" },
  { v: "Khagaria", l: "Khagaria" },
  { v: "Kishanganj", l: "Kishanganj" },
  { v: "Lakhisarai", l: "Lakhisarai" },
  { v: "Madhepura", l: "Madhepura" },
  { v: "Madhubani", l: "Madhubani" },
  { v: "Munger", l: "Munger" },
  { v: "Muzaffarpur", l: "Muzaffarpur" },
  { v: "Nalanda", l: "Nalanda" },
  { v: "Nawada", l: "Nawada" },
  { v: "Patna", l: "Patna" },
  { v: "Purnia", l: "Purnia" },
  { v: "Rohtas", l: "Rohtas" },
  { v: "Saharsa", l: "Saharsa" },
  { v: "Samastipur", l: "Samastipur" },
  { v: "Saran", l: "Saran" },
  { v: "Sheikhpura", l: "Sheikhpura" },
  { v: "Sheohar", l: "Sheohar" },
  { v: "Sitamarhi", l: "Sitamarhi" },
  { v: "Siwan", l: "Siwan" },
  { v: "Supaul", l: "Supaul" },
  { v: "Vaishali", l: "Vaishali" },
  { v: "West Champaran", l: "West Champaran" }
];

// Main Dashboard Component
export default function Dashboard() {
  const [step, setstep] = useState(0);
  const [me, setMe] = useState({ mobile: "demo-user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(() => {
    // If returning from the review page to edit, repopulate the form
    if (location.state?.formData) {
      return location.state.formData;
    }
    // Otherwise, start with a fresh form
    return {
      applicantName: "",
      fatherName: "",
      motherName: "",
      dob: "",
      religion: "",
      gender: "",
      handicapped: "",
      disabilityDegree: "",
      aadhar: "",
      income: "",
      nationality: "",
      maritalStatus: "",
      incomeCert: null,
      email: "",
      mobile: "",
      telephone: "",
      domicileBihar: "",
      residentialCert: null,
      district: "",
      address: "",
      permanentAddress: "",
      choiceDistrict: "",
      jobRoleChoice: "",
      qualification: "",
      marksheet: null,
      previousTraining: "",
      previousTrainingDetails: "",
      signature: null,
      photo: null,
      selfDeclaration: false,
      place: "",
      date: "",
    };
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setMe({ mobile: "demo-user" });
  }, []);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    
    // Clear previous error for this field
    setFieldErrors(prev => ({ ...prev, [name]: "" }));
    
    // Number-only fields validation
    const numberOnlyFields = ['aadhar', 'income', 'mobile', 'telephone'];
    if (numberOnlyFields.includes(name) && value && !/^\d*$/.test(value)) {
      setFieldErrors(prev => ({ 
        ...prev, 
        [name]: `${getFieldDisplayName(name)} should contain only numbers` 
      }));
      return;
    }

    // Real-time Aadhar validation
    if (name === "aadhar" && value) {
      if (value.length > 12) {
        setFieldErrors(prev => ({ 
          ...prev, 
          [name]: "Aadhar number should be maximum 12 digits" 
        }));
        return;
      } else if (value.length > 0 && value.length < 12) {
        setFieldErrors(prev => ({ 
          ...prev, 
          [name]: "Aadhar number must be exactly 12 digits" 
        }));
      }
    }

    // Real-time Mobile validation
    if (name === "mobile" && value) {
      if (value.length > 10) {
        setFieldErrors(prev => ({ 
          ...prev, 
          [name]: "Mobile number should be maximum 10 digits" 
        }));
        return;
      } else if (value.length > 0 && value.length < 10) {
        setFieldErrors(prev => ({ 
          ...prev, 
          [name]: "Mobile number must be exactly 10 digits" 
        }));
      }
    }

    // Email validation
    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldErrors(prev => ({ 
        ...prev, 
        [name]: "Please enter a valid email address" 
      }));
    }

    // File validation
    if (type === "file" && files && files[0]) {
      const file = files[0];
      if (name === "signature" && file.type !== "application/pdf") {
        setFieldErrors(prev => ({ 
          ...prev, 
          [name]: "Please upload PDF file only" 
        }));
        return;
      }
      if (name === "photo" && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setFieldErrors(prev => ({ 
          ...prev, 
          [name]: "Please upload JPG, JPEG or PNG file only" 
        }));
        return;
      }
      if ((name === "incomeCert" || name === "residentialCert" || name === "marksheet") && file.type !== "application/pdf") {
        setFieldErrors(prev => ({ 
          ...prev, 
          [name]: "Please upload PDF file only" 
        }));
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0] || prev[name]
          : value,
    }));
  }

  function getFieldDisplayName(fieldName) {
    const fieldNames = {
      aadhar: "Aadhar number",
      income: "Annual income",
      mobile: "Mobile number",
      telephone: "Telephone number"
    };
    return fieldNames[fieldName] || fieldName;
  }

  function goToStep(stepIndex) {
    setstep(stepIndex);
  }

  function nextStep() {
    if (step < steps.length - 1) setstep((s) => s + 1);
  }

  function prevStep() {
    if (step > 0) setstep((s) => s - 1);
  }

  function validateBeforeSubmit() {
    const required = {
      applicantName: "Name of Applicant",
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      dob: "Date of Birth",
      religion: "Religion",
      gender: "Gender",
      handicapped: "Physically Handicapped (Yes/No)",
      aadhar: "Aadhar Number",
      income: "Annual Income",
      nationality: "Nationality",
      maritalStatus: "Marital Status",
      mobile: "Mobile Number",
      domicileBihar: "Are you domicile/native of Bihar?",
      district: "District Name",
      address: "Address for Correspondence",
      permanentAddress: "Permanent Address",
      choiceDistrict: "Choice of District (MSY)",
      jobRoleChoice: "Job Role",
      qualification: "Highest Educational Qualification",
      previousTraining: "Previous Training (Yes/No)",
      selfDeclaration: "Self Declaration",
      place: "Place",
      date: "Date",
    };

    for (const key in required) {
      const val = form[key];
      if (key === "selfDeclaration" && !val) {
        return `${required[key]} is required.`;
      }
      if (val == null) return `${required[key]} is required.`;
      if (typeof val === "string" && val.trim() === "") {
        return `${required[key]} is required.`;
      }
    }

    // Additional validations
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }
    if (form.mobile && (!/^\d{10}$/.test(form.mobile))) {
      return "Mobile number must be exactly 10 digits.";
    }
    if (form.aadhar && (!/^\d{12}$/.test(form.aadhar))) {
      return "Aadhar number must be exactly 12 digits.";
    }
    if (form.telephone && form.telephone && !/^\d+$/.test(form.telephone)) {
      return "Telephone number should contain only digits.";
    }
    if (form.handicapped === "Yes" && !form.disabilityDegree.trim()) {
      return "Degree of Disability is required when Physically Handicapped is Yes.";
    }
    if (form.previousTraining === "Yes" && !form.previousTrainingDetails.trim()) {
      return "Please provide previous training details.";
    }
    return "";
  }

  function submitApplication(e) {
    if (e) e.preventDefault();
    setMessage("");
    const err = validateBeforeSubmit();
    if (err) {
      setMessage(err);
      return;
    }
    // Navigate to the review page with the form data
    navigate('/review', { state: { formData: form } });
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6" style={{ backgroundColor: "#372948" }}>
      <div className="max-w-6xl mx-auto my-4 sm:my-6 lg:my-10 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23372948' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
        </div>
        
        <div className="relative z-10">
            <div className="mb-6 lg:mb-8">
                <p className="text-center text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 px-2">
                    Complete all steps to submit your application
                </p>
                
                {/* Mobile step navigation - stack vertically on very small screens */}
                <div className="block sm:hidden mb-4">
                    <div className="grid grid-cols-1 gap-2">
                        {steps.map((s, i) => (
                            <button
                            key={s.id}
                            onClick={() => goToStep(i)}
                            className={`cursor-pointer hover:opacity-80 transition-all duration-300 text-center px-3 py-3 rounded-lg text-xs ${
                                i === step ? "font-semibold shadow-md" : "hover:font-medium"
                            }`}
                            style={{ 
                                color: i === step ? "#372948" : "#6b7280",
                                backgroundColor: i === step ? "#f3f0f7" : "transparent",
                                border: i === step ? "2px solid #372948" : "1px solid #e5e7eb"
                            }}
                            dangerouslySetInnerHTML={{ __html: s.label }}
                            >
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop/tablet step navigation - horizontal */}
                <div className="hidden sm:flex justify-between text-xs sm:text-sm lg:text-base font-medium mb-4">
                    {steps.map((s, i) => (
                        <button
                        key={s.id}
                        onClick={() => goToStep(i)}
                        className={`cursor-pointer hover:opacity-80 transition-all duration-300 text-center flex-1 px-2 py-3 rounded-lg mx-1 ${
                            i === step ? "font-semibold shadow-md" : "hover:font-medium"
                        }`}
                        style={{ 
                            color: i === step ? "#372948" : "#6b7280",
                            backgroundColor: i === step ? "#f3f0f7" : "transparent",
                            border: i === step ? "1px solid #372948" : "1px solid transparent"
                        }}
                        dangerouslySetInnerHTML={{ __html: s.label }}
                        >
                        </button>
                    ))}
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 shadow-inner">
                    <div
                        className="h-2 sm:h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{
                        backgroundColor: "#372948",
                        width: `${((step + 1) / steps.length) * 100}%`,
                        background: "linear-gradient(90deg, #372948 0%, #4a325d 100%)"
                        }}
                    />
                </div>
            </div>

            {message && (
                <div
                className={`mb-4 sm:mb-6 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm border shadow-lg animate-pulse
                ${message.includes("successfully")
                    ? "bg-green-50 text-green-700 border-green-200 shadow-green-100"
                    : "bg-amber-50 text-amber-900 border-amber-300 shadow-amber-100"}`}
                role="alert"
                >
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-2 h-2 rounded-full ${message.includes("successfully") ? "bg-green-500" : "bg-amber-500"}`}></div>
                    <span className="break-words">{message}</span>
                </div>
                </div>
            )}

            <form
                onSubmit={submitApplication}
                className="space-y-6 sm:space-y-8 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-inner"
                style={{ 
                backgroundColor: "#f8f7fa", 
                border: "2px solid #372948",
                background: "linear-gradient(135deg, #f8f7fa 0%, #f3f0f7 100%)"
                }}
            >
                {steps.map((s, i) => (
                <div 
                    key={s.id} 
                    style={{ display: step === i ? 'block' : 'none' }}
                    className="animate-fadeIn"
                >
                    {renderStepContent(i, form, handleChange, me, steps, nextStep, prevStep, submitApplication, fieldErrors)}
                </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-300">
                {step > 0 ? (
                    <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:shadow-md disabled:opacity-60 transition-all duration-300 font-medium order-2 sm:order-1"
                    style={{ border: "2px solid #372948" }}
                    >
                    ← Previous
                    </button>
                ) : (
                    <span className="hidden sm:block" />
                )}
                {step < steps.length - 1 ? (
                    <button
                    type="button"
                    onClick={nextStep}
                    style={{ backgroundColor: "#372948" }}
                    className="w-full sm:w-auto text-white px-8 py-3 rounded-full transition-all duration-300 disabled:opacity-60 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 order-1 sm:order-2"
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#4a325d"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#372948"}
                    >
                    Next Step →
                    </button>
                ) : (
                    <button
                    type="submit"
                    style={{ backgroundColor: "#372948" }}
                    className="w-full sm:w-auto text-white px-8 py-3 rounded-full transition-all duration-300 disabled:opacity-60 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 order-1 sm:order-2"
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#4a325d"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#4a325d"}
                    >
                    Review Application
                    </button>
                )}
                </div>
            </form>
            
            <div className="mt-8 sm:mt-12 text-center border-t border-gray-200 pt-4 sm:pt-6">
                <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 inline-block px-3 sm:px-4 py-2 rounded-full">
                📞 Helpdesk: 0612224975
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
// Paste the unchanged renderStepContent, Field, Select, RadioGroup, TextArea, 
// and FileField functions here...
function renderStepContent(step, form, handleChange, me, steps, nextStep, prevStep, submitApplication, fieldErrors) {
  switch (step) {
    case 0:
      return (
        <section className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 px-1" style={{ color: "#372948" }}>
            1. Personal Information<br/>व्यक्तिगत जानकारी
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <Field
              label="Name of Applicant<br/>आवेदक का नाम*"
              required
              name="applicantName"
              value={form.applicantName}
              onChange={handleChange}
            />
            <Field
              label="Father's Name<br/>पिता का नाम*"
              required
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
            />
            <Field
              label="Mother's Name<br/>माता का नाम*"
              required
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
            />
            <Field
              type="date"
              label="Date of Birth<br/>जन्म तिथि*"
              required
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
            <Select
              label="Religion<br/>धर्म*"
              required
              name="religion"
              value={form.religion}
              onChange={handleChange}
              options={[
                { v: "", l: "Select" },
                { v: "Hindu", l: "Hindu / हिन्दू" },
                { v: "Islam", l: "Islam / मुस्लिम" },
                { v: "Christianity", l: "Christianity / इसाई" },
                { v: "Sikhism", l: "Sikhism / सिख" },
                { v: "Buddhism", l: "Buddhism / बौद्ध" },
                { v: "Jainism", l: "Jainism / जैन" },
                { v: "Zoroastrianism", l: "Zoroastrianism / पारसी" },
              ]}
            />
            <RadioGroup
              label="Gender<br/>लिंग*"
              required
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { v: "Male", l: "Male / पुरुष" },
                { v: "Female", l: "Female / महिला" },
                { v: "Other", l: "Other" },
              ]}
            />
            <RadioGroup
              label="Physically Handicapped<br/>शारीरिक रूप से विकलांग*"
              required
              name="handicapped"
              value={form.handicapped}
              onChange={handleChange}
              options={[
                { v: "Yes", l: "Yes / हाँ" },
                { v: "No", l: "No / नहीं" },
              ]}
            />
            {form.handicapped === "Yes" && (
              <Field
                label="Degree of Disability<br/>विकलांगता का विवरण"
                name="disabilityDegree"
                value={form.disabilityDegree}
                onChange={handleChange}
              />
            )}
          </div>
        </section>
      );
    case 1:
      return (
        <section className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 px-1" style={{ color: "#372948" }}>
            2. Additional Details<br/>अतिरिक्त विवरण
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Field
              label="Aadhar Number<br/>आधार संख्या*"
              required
              name="aadhar"
              value={form.aadhar}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={12}
              placeholder="Enter 12-digit Aadhar number"
              error={fieldErrors.aadhar}
            />
            <Field
              label="Annual Income<br/>वार्षिक आय*"
              required
              name="income"
              value={form.income}
              onChange={handleChange}
              inputMode="numeric"
              placeholder="Enter annual income in numbers"
              error={fieldErrors.income}
            />
            <FileField
              label="Income Certificate<br/>आय प्रमाण पत्र*"
              required
              name="incomeCert"
              onChange={handleChange}
              fileValue={form.incomeCert}
              accept=".pdf"
              error={fieldErrors.incomeCert}
            />
            <Select
              label="Nationality<br/>नागरिकता*"
              required
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              options={[
                { v: "", l: "Select" },
                { v: "Indian", l: "Indian / भारतीय" },
                { v: "Non-Indian", l: "Non-Indian / ग़ैर भारतीय" },
                { v: "Other", l: "Other" },
              ]}
            />
            <Select
              label="Marital Status<br/>वैवाहिक स्थिति*"
              required
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              options={[
                { v: "", l: "Select" },
                { v: "Married", l: "Married / विवाहित" },
                { v: "Unmarried", l: "Unmarried / अविवाहित" },
                { v: "Separated", l: "Separated / परित्यक्ता" },
                { v: "Divorced", l: "Divorced / तलाकशुदा" },
              ]}
            />
          </div>
        </section>
      );
    case 2:
      return (
        <section className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 px-1" style={{ color: "#372948" }}>
            3. Contact & Address<br/>संपर्क और पता
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Field 
              label="Email<br/>ई-मेल" 
              name="email" 
              type="email"
              value={form.email} 
              onChange={handleChange}
              error={fieldErrors.email}
            />
            <Field
              label="Mobile Number<br/>मोबाइल नंबर*"
              required
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              error={fieldErrors.mobile}
            />
            <Field
              label="Telephone Number with STD Code<br/>टेलीफोन नंबर"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              inputMode="numeric"
              placeholder="Enter telephone number"
              error={fieldErrors.telephone}
            />

            <RadioGroup
              label="Are you a domicile/native of Bihar?<br/>क्या आप बिहार राज्य के मूल निवासी हैं?*"
              required
              name="domicileBihar"
              value={form.domicileBihar}
              onChange={handleChange}
              options={[
                { v: "Yes", l: "Yes / हाँ" },
                { v: "No", l: "No / नहीं" },
              ]}
            />

            <FileField
              label="Residential Certificate<br/>आवासीय प्रमाण पत्र*"
              required
              name="residentialCert"
              onChange={handleChange}
              fileValue={form.residentialCert}
              accept=".pdf"
              error={fieldErrors.residentialCert}
            />

            <Select
              label="District Name<br/>जिला का नाम*"
              required
              name="district"
              value={form.district}
              onChange={handleChange}
              options={biharDistricts}
            />

            <TextArea
              label="Address for Correspondence<br/>पत्राचार का पता*"
              required
              name="address"
              value={form.address}
              onChange={handleChange}
            />
            <TextArea
              label="Permanent Address<br/>स्थायी पता*"
              required
              name="permanentAddress"
              value={form.permanentAddress}
              onChange={handleChange}
            />
          </div>
        </section>
      );
    case 3:
      return (
        <section className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 px-1" style={{ color: "#372948" }}>
            4. Education & Training<br/>शिक्षा और प्रशिक्षण
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Select
              label="Choice of District (MSY)<br/>कौशल प्रशिक्षण कार्यक्रम हेतु जिला का चुनाव*"
              required
              name="choiceDistrict"
              value={form.choiceDistrict}
              onChange={handleChange}
              options={[
                { v: "", l: "Select District" },
                { v: "District 1", l: "District 1" },
                { v: "District 2", l: "District 2" },
                { v: "District 3", l: "District 3" },
              ]}
            />
            <Select
              label="Job Role<br/>जॉब रोल*"
              required
              name="jobRoleChoice"
              value={form.jobRoleChoice}
              onChange={handleChange}
              options={[
                { v: "", l: "Select" },
                { v: "Job Role 1", l: "Job Role 1" },
                { v: "Job Role 2", l: "Job Role 2" },
                { v: "Job Role 3", l: "Job Role 3" },
              ]}
            />

            <Select
              label="Highest Educational Qualification<br/>उच्चतम योग्यता*"
              required
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              options={[
                { v: "", l: "Select" },
                { v: "Class 7 passed", l: "Class 7 passed" },
                { v: "Class 8 passed", l: "Class 8 passed" },
                { v: "Class 9 passed", l: "Class 9 passed" },
                { v: "Class 10 passed", l: "Class 10 passed" },
                { v: "Class 11 passed", l: "Class 11 passed" },
                { v: "Class 12 passed", l: "Class 12 passed" },
                { v: "Graduate or Higher", l: "Graduate or Higher" },
              ]}
            />

            <FileField
              label="Marksheet of Highest Degree<br/>उच्चतम योग्यता की मार्कशीट*"
              required
              name="marksheet"
              onChange={handleChange}
              fileValue={form.marksheet}
              accept=".pdf"
              error={fieldErrors.marksheet}
            />

            <RadioGroup
              label="Previous Training<br/>पूर्व प्रशिक्षण*"
              required
              name="previousTraining"
              value={form.previousTraining}
              onChange={handleChange}
              options={[
                { v: "Yes", l: "हाँ" },
                { v: "No", l: "नहीं" },
              ]}
            />

            {form.previousTraining === "Yes" && (
              <div className="sm:col-span-2 lg:col-span-3">
                <TextArea
                  label="Training Details<br/>प्रशिक्षण का विवरण"
                  name="previousTrainingDetails"
                  value={form.previousTrainingDetails}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </section>
      );
    case 4:
      return (
        <section className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 px-1" style={{ color: "#372948" }}>
            5. Uploads & Declaration<br/>अपलोड और घोषणा
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FileField
              label="Upload Signature<br/>हस्ताक्षर अपलोड करें*"
              required
              name="signature"
              onChange={handleChange}
              fileValue={form.signature}
              accept=".pdf"
              error={fieldErrors.signature}
            />
            <FileField
              label="Candidate Photo<br/>उम्मीदवार की फोटो*"
              required
              name="photo"
              onChange={handleChange}
              fileValue={form.photo}
              accept=".jpg,.jpeg,.png"
              error={fieldErrors.photo}
            />

            <div className="sm:col-span-2">
              <p className="text-sm text-gray-800 rounded-lg p-3 mb-3" style={{ backgroundColor: "#f2ecf8", border: "1px solid #372948" }}>
                <strong>Self Declaration / स्व-घोषणा*</strong>
                <br />
                मैं घोषणा करता / करती हूँ कि इस आवेदन पत्र में मेरे द्वारा
                समर्पित सूचना मेरी जानकारी एवं विश्वास में सही है।
              </p>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="selfDeclaration"
                  checked={!!form.selfDeclaration}
                  onChange={handleChange}
                  className="h-4 w-4 mt-1 flex-shrink-0" 
                  style={{ accentColor: "#372948" }}
                  aria-label="Self Declaration"
                />
                <span className="text-sm leading-relaxed">
                  I agree / मैं सहमत हूँ
                </span>
              </div>
            </div>

            <Field
              label="Place<br/>स्थान*"
              required
              name="place"
              value={form.place}
              onChange={handleChange}
            />
            <Field
              type="date"
              label="Date<br/>तिथि*"
              required
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </section>
      );
    default:
      return null;
  }
}

// Form field components
function Field({ label, name, value, onChange, type = "text", required = false, inputMode, maxLength, placeholder, error }) {
  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: label }}></label>
      <input
        type={type}
        id={name} 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-lg bg-white px-3 sm:px-4 py-2 sm:py-3 transition-all outline-none focus:ring-2 focus:ring-[#4a325d] text-sm sm:text-base"
        style={{
          border: error ? "2px solid #dc2626" : "1px solid #372948"
        }}
      />
      {error && (
        <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded border-l-2 border-red-600 break-words">
          {error}
        </div>
      )}
    </div>
  );
}

function Select({ label, name, value, onChange, options, required = false }) {
  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: label }}></label>
      <select
        id={name} 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-lg bg-white px-3 sm:px-4 py-2 sm:py-3 transition-all outline-none focus:ring-2 focus:ring-[#4a325d] text-sm sm:text-base"
        style={{ border: "1px solid #372948" }}
      >
        {options.map((opt) => (
          <option key={opt.v} value={opt.v}>
            {opt.l}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroup({ label, name, value, onChange, options, required = false }) {
  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: label }}></label>
      <div className="space-y-2">
        {options.map((opt) => (
          <div key={opt.v} className="flex items-start">
            <input
              type="radio"
              id={`${name}-${opt.v}`} 
              name={name}
              value={opt.v}
              checked={value === opt.v}
              onChange={onChange}
              required={required}
              className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-[#4a325d] mt-0.5 flex-shrink-0"
              style={{ accentColor: "#372948" }}
            />
            <label htmlFor={`${name}-${opt.v}`} className="ml-2 text-xs sm:text-sm text-gray-700 leading-relaxed break-words">{opt.l}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextArea({ label, name, value, onChange, required = false }) {
  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: label }}></label>
      <textarea
        id={name} 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={3}
        className="mt-1 block w-full rounded-lg bg-white px-3 sm:px-4 py-2 sm:py-3 transition-all outline-none focus:ring-2 focus:ring-[#4a325d] text-sm sm:text-base resize-y min-h-[80px]"
        style={{ border: "1px solid #372948" }}
      />
    </div>
  );
}

function FileField({ label, name, onChange, required = false, fileValue, accept, error }) {
  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: label }}></label>
      <input
        type="file"
        id={name} 
        name={name}
        onChange={onChange}
        required={required && !fileValue}
        accept={accept}
        className="mt-1 block w-full text-xs sm:text-sm text-gray-700 rounded-lg px-3 py-2 transition-all outline-none focus:ring-2 focus:ring-[#4a325d] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        style={{
          border: error ? "2px solid #dc2626" : "1px solid #372948",
          backgroundColor: "white"
        }}
      />
      {error && (
        <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded border-l-2 border-red-600 break-words">
          {error}
        </div>
      )}
      {fileValue && fileValue.name && (
        <div className="text-xs text-green-600 mt-1 bg-green-50 px-2 py-1 rounded border-l-2 border-green-600 break-words">
          ✓ Selected: {fileValue.name}
        </div>
      )}
    </div>
  );
}