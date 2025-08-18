import React, { useEffect, useState } from "react";
// import { api, getToken, clearToken } from "../lib/api"; // Removed api import
import ReviewApplication from "./ReviewApplication";
import classNames from 'classnames';

const steps = [
  { id: 'personal', label: "Personal Information<br/>व्यक्तिगत जानकारी" },
  { id: 'additional', label: "Additional Details<br/>अतिरिक्त विवरण" },
  { id: 'contact', label: "Contact & Address<br/>संपर्क और पता" },
  { id: 'education', label: "Education & Training<br/>शिक्षा और प्रशिक्षण" },
  { id: 'uploads', label: "Uploads & Declaration<br/>अपलोड और घोषणा" },
];

export default function Dashboard() {
  const [step, setstep] = useState(0);
  const [me, setMe] = useState({ mobile: "demo-user" }); // Simulate a demo user
  const [message, setMessage] = useState("");
  const [showReviewPage, setShowReviewPage] = useState(false);

  const [form, setForm] = useState(() => {
    const savedForm = localStorage.getItem("applicationForm");
    return savedForm
      ? JSON.parse(savedForm)
      : {
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

  useEffect(() => {
    // const token = getToken(); // Removed getToken call
    // if (token) {
    //   loadMe();
    // }
    // No backend for now, so no need to load user data from backend
  }, []);

  async function loadMe() {
    // const token = getToken(); // Removed getToken call
    // if (!token) return;
    
    // try {
    //   const res = await api("/auth/me", { // Removed API call
    //     headers: { Authorization: `Bearer ${getToken()}` },
    //   });
    //   setMe(res);
    // } catch (e) {
    //   setMessage(e.message || "Failed to load user");
    // }
    setMe({ mobile: "demo-user" }); // Always simulate a demo user
  }

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
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

  function goToStep(stepIndex) {
    setstep(stepIndex);
  }

  function nextStep() {
    if (step < steps.length - 1) setstep((s) => s + 1);
  }

  function prevStep() {
    if (step > 0) setstep((s) => s - 1);
  }

  function logout() {
    // clearToken(); // Removed clearToken call
    window.location.href = "/login";
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
      incomeCert: "Income Certificate",
      mobile: "Mobile Number",
      domicileBihar: "Are you domicile/native of Bihar?",
      residentialCert: "Residential Certificate",
      district: "District Name",
      address: "Address for Correspondence",
      permanentAddress: "Permanent Address",
      choiceDistrict: "Choice of District (MSY)",
      jobRoleChoice: "Job Role",
      qualification: "Highest Educational Qualification",
      marksheet: "Marksheet of Highest Degree",
      previousTraining: "Previous Training (Yes/No)",
      signature: "Upload Signature",
      photo: "Candidate Photo",
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
      if (val instanceof File && val.size === 0) {
        return `${required[key]} is required.`;
      }
    }

    if (form.handicapped === "Yes" && !form.disabilityDegree.trim()) {
      return "Degree of Disability is required when Physically Handicapped is Yes.";
    }
    if (form.previousTraining === "Yes" && !form.previousTrainingDetails.trim()) {
      return "Please provide previous training details.";
    }
    return "";
  }

  function resetForm() {
    setForm({
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
    });
    setstep(0);
  }

  async function finalSubmitApplication(e) {
    if (e) e.preventDefault();
    setMessage("");

    const err = validateBeforeSubmit();
    if (err) {
      setMessage(err);
      return;
    }

    // const token = getToken(); // Removed getToken call
    // if (!token) {
    //   setMessage("Please login to submit application.");
    //   return;
    // }

    // try {
    //   const formData = new FormData();
    //   Object.entries(form).forEach(([k, v]) => {
    //     if (v instanceof File) {
    //       formData.append(k, v);
    //     } else if (v !== null && v !== undefined && v !== "") {
    //       formData.append(k, v);
    //     }
    //   });

    //   const response = await api("/applications", { // Removed API call
    //     method: "POST",
    //     headers: { Authorization: `Bearer ${token}` },
    //     body: formData,
    //   });

    //   setMessage("Your application has been submitted successfully!");
    //   resetForm();
    //   setShowReviewPage(false);
    // } catch (e) {
    //   if (e.response) {
    //     setMessage(`Submission failed: ${e.response.message || e.response.error || e.message}`);
    //   } else {
    //     setMessage(e.message || "Submission failed.");
    //   }
    // }
    setMessage("Your application has been submitted successfully (simulated)!"); // Simulate success
    resetForm();
    setShowReviewPage(false);
  }

  function submitApplication(e) {
    if (e) e.preventDefault();
    const err = validateBeforeSubmit();
    if (err) {
      setMessage(err);
      return;
    }
    setShowReviewPage(true);
  }

  function handleEdit() {
    setShowReviewPage(false);
  }

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: "linear-gradient(to bottom right, #372948, #241630)" }}>
      <div className="max-w-5xl mx-auto my-6 sm:my-10 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Removed Dashboard header */}
        </div>

        {/* Progress - Clickable Steps */}
        <div className="mb-6">
          <div className="flex justify-between text-[11px] sm:text-xs md:text-sm font-medium mb-1">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={classNames(
                  "cursor-pointer hover:opacity-80 transition-all",
                  i === step
                    ? "font-semibold"
                    : "hover:font-medium"
                )}
                style={{ color: i === step ? "#372948" : "#6b7280" }}
                dangerouslySetInnerHTML={{ __html: s.label }}
              >
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                backgroundColor: "#372948",
                width: `${((step + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm border
            ${message.includes("successfully")
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-900 border-amber-300"}`}
            role="alert"
          >
            {message}
          </div>
        )}

        {showReviewPage ? (
          <ReviewApplication
            formData={form}
            onEdit={handleEdit}
            onFinalSubmit={finalSubmitApplication}
          />
        ) : (
          <form
            onSubmit={submitApplication}
            className="space-y-6 rounded-2xl p-4 sm:p-6"
            style={{ backgroundColor: "#f8f7fa", border: "1px solid #372948" }}
          >
            {
              // Render all steps, but only display the current one
              steps.map((s, i) => (
                <div key={s.id} style={{ display: step === i ? 'block' : 'none' }}>
                  {renderStepContent(i, form, handleChange, me, steps, nextStep, prevStep, submitApplication)}
                </div>
              ))
            }

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 disabled:opacity-60 transition-all"
                  style={{ border: "1px solid #372948" }}
                >
                  Previous
                </button>
              ) : (
                <span />
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{ backgroundColor: "#372948" }}
                  className="text-white px-6 py-2 rounded-full transition-all duration-200 disabled:opacity-60"
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#4a325d"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#372948"}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  style={{ backgroundColor: "#372948" }}
                  className="text-white px-6 py-2 rounded-full transition-all duration-200 disabled:opacity-60"
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#4a325d"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#4a325d"}
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        )}

        <div className="mt-10 text-center">
          <div className="text-xs text-gray-500">Helpdesk: 0612224975</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step Renderer ---------- */
function renderStepContent(step, form, handleChange, me, steps, nextStep, prevStep, submitApplication) {
  switch (step) {
    case 0:
      return (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#372948" }}>
            1. Personal Information<br/>व्यक्तिगत जानकारी
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#372948" }}>
            2. Additional Details<br/>अतिरिक्त विवरण
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field
              label="Aadhar Number<br/>आधार संख्या*"
              required
              name="aadhar"
              value={form.aadhar}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={12}
            />
            <Field
              label="Annual Income<br/>वार्षिक आय*"
              required
              name="income"
              value={form.income}
              onChange={handleChange}
              inputMode="numeric"
            />
            <FileField
              label="Income Certificate<br/>आय प्रमाण पत्र*"
              required
              name="incomeCert"
              onChange={handleChange}
              fileValue={form.incomeCert} // Pass fileValue to display selected file name
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
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#372948" }}>
            3. Contact & Address<br/>संपर्क और पता
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Email<br/>ई-मेल" name="email" value={form.email} onChange={handleChange} />
            <Field
              label="Mobile Number<br/>मोबाइल नंबर*"
              required
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              inputMode="tel"
            />
            <Field
              label="Telephone Number with STD Code<br/>टेलीफोन नंबर"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              inputMode="tel"
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
              fileValue={form.residentialCert} // Pass fileValue to display selected file name
            />

            <Field
              label="District Name<br/>जिला का नाम*"
              required
              name="district"
              value={form.district}
              onChange={handleChange}
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
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#372948" }}>
            4. Education & Training<br/>शिक्षा और प्रशिक्षण
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field
              label="Choice of District (MSY)<br/>कौशल प्रशिक्षण कार्यक्रम हेतु जिला का चुनाव*"
              required
              name="choiceDistrict"
              value={form.choiceDistrict}
              onChange={handleChange}
            />
            <Field
              label="Job Role<br/>जॉब रोल*"
              required
              name="jobRoleChoice"
              value={form.jobRoleChoice}
              onChange={handleChange}
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
              fileValue={form.marksheet} // Pass fileValue to display selected file name
            />

            <RadioGroup
              label="क्या आपने पहले बिहार राज्य अल्पसंख्यक वित्तीय निगम द्वारा प्रायोजित किसी कौशल विकास कार्यक्रम में प्रशिक्षण लिया है?<br/>*"
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
              <TextArea
                label="यदि हाँ, तो उसका विवरण अंकित करें"
                name="previousTrainingDetails"
                value={form.previousTrainingDetails}
                onChange={handleChange}
              />
            )}
          </div>
        </section>
      );
    case 4:
      return (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#372948" }}>
            5. Uploads & Declaration<br/>अपलोड और घोषणा
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FileField
              label="Income Certificate<br/>आय प्रमाण पत्र*"
              required
              name="incomeCert"
              onChange={handleChange}
              fileValue={form.incomeCert} // Pass fileValue to display selected file name
            />
            <FileField
              label="Upload Signature*<br/>"
              required
              name="signature"
              onChange={handleChange}
              fileValue={form.signature} // Pass fileValue to display selected file name
            />
            <FileField
              label="Candidate Photo*<br/>"
              required
              name="photo"
              onChange={handleChange}
              fileValue={form.photo} // Pass fileValue to display selected file name
            />

            <div className="md:col-span-3">
              <p className="text-sm text-gray-800 rounded-lg p-3" style={{ backgroundColor: "#f2ecf8", border: "1px solid #372948" }}>
                <strong>Self Declaration / स्व-घोषणा*</strong>
                <br />
                मैं घोषणा करता / करती हूँ कि इस आवेदन पत्र में मेरे द्वारा
                समर्पित सूचना मेरी जानकारी एवं विश्वास में सही है। किसी भी समय
                मेरे द्वारा दी गयी जानकारी अथवा उसका कोई अंश गलत पाए जाने या
                कोई प्रासंगिक जानकारी छुपाये जाने का दृष्टांत प्राप्त होने पर
                मेरा चयन बिना किसी पूर्व सूचना के समाप्त किया जा सकेगा।
              </p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="selfDeclaration"
                  checked={!!form.selfDeclaration}
                  onChange={handleChange}
                  className="h-4 w-4" // Removed text-indigo-600
                  style={{ accentColor: "#372948" }}
                  aria-label="Self Declaration"
                />
                <span className="ml-2 text-sm">
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

/* ---------- UI helpers ---------- */
function Field({ label, name, value, onChange, type = "text", required = false, inputMode, maxLength }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: label }}></label>
      <input
        type={type}
        id={name} // Added id for accessibility
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        className="mt-1 block w-full rounded-lg bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-[#4a325d]" /* Added focus ring */
        style={{
          border: "1px solid #372948"
        }}
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: label }}></label>
      <select
        id={name} // Added id for accessibility
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-lg bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-[#4a325d]" /* Added focus ring */
        style={{
          border: "1px solid #372948"
        }}
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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: label }}></label>
      <div className="space-y-2">
        {options.map((opt) => (
          <div key={opt.v} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${opt.v}`} // Unique ID for radio inputs
              name={name}
              value={opt.v}
              checked={value === opt.v}
              onChange={onChange}
              required={required}
              className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-[#4a325d]" /* Added focus ring */
              style={{ accentColor: "#372948" }}
            />
            <label htmlFor={`${name}-${opt.v}`} className="ml-2 text-sm text-gray-700">{opt.l}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextArea({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: label }}></label>
      <textarea
        id={name} // Added id for accessibility
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={3}
        className="mt-1 block w-full rounded-lg bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-[#4a325d]" /* Added focus ring */
        style={{
          border: "1px solid #372948"
        }}
      />
    </div>
  );
}

function FileField({ label, name, onChange, required = false, fileValue }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: label }}></label>
      <input
        type="file"
        id={name} // Added id for accessibility
        name={name}
        onChange={onChange}
        required={required && !fileValue}
        className="mt-1 block w-full text-sm text-gray-700 rounded-lg px-3 py-2 transition-all outline-none focus:ring-2 focus:ring-[#4a325d]" /* Added focus ring */
        style={{
          border: "1px solid #372948",
          backgroundColor: "white"
        }}
      />
      {fileValue && fileValue.name && (
        <div className="text-xs text-green-600 mt-1">Selected: {fileValue.name}</div>
      )}
    </div>
  );
}