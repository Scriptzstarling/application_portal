import React, { useEffect, useState } from "react";
import { api, getToken, clearToken } from "../lib/api";

const steps = [
  "Personal Information / व्यक्तिगत जानकारी",
  "Additional Details / अतिरिक्त विवरण",
  "Contact & Address / संपर्क और पता",
  "Education & Training / शिक्षा और प्रशिक्षण",
  "Uploads & Declaration / अपलोड और घोषणा",
];

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(0);

  // Form state keys aligned to NIC fields (bilingual labels kept in UI)
  const [form, setForm] = useState({
    // Step 0 — Personal
    applicantName: "",
    fatherName: "",
    motherName: "",
    dob: "",

    // Step 1 — Additional
    religion: "",
    gender: "",
    handicapped: "", // "Yes" | "No"
    disabilityDegree: "",

    aadhar: "",
    income: "",
    nationality: "", // "Indian" | "Non-Indian" | "Other"
    maritalStatus: "", // Married | Unmarried | Separated | Divorced

    // Step 2 — Contact & Address
    email: "",
    mobile: "",
    telephone: "",
    domicileBihar: "", // "Yes" | "No"
    residentialCert: null, // required
    district: "",
    address: "",
    permanentAddress: "",

    // Step 3 — Education & Training
    choiceDistrict: "", // "Choice of District ... (MSY)"
    jobRoleChoice: "",
    qualification: "", // fixed list
    marksheet: null, // required
    prevTraining: "", // "Yes" | "No"
    prevTrainingDetails: "",

    // Step 4 — Uploads & Declaration
    incomeCert: null, // required
    signature: null, // required
    photo: null, // required
    selfDeclaration: false, // must be checked
    place: "",
    date: "",
  });

  const [applications, setApplications] = useState([]);
  const [me, setMe] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadMe();
    loadApplications();
  }, []);

  async function loadMe() {
    try {
      const res = await api("/auth/me", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMe(res);
    } catch (e) {
      setMessage(e.message || "Failed to load user");
    }
  }

  async function loadApplications() {
    try {
      const list = await api("/applications", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setApplications(list || []);
    } catch (e) {
      setMessage(e.message || "Failed to load applications");
    }
  }

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? (files?.[0] ?? null)
          : value,
    }));
  }

  function nextStep() {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  }

  function prevStep() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  function logout() {
    clearToken();
    window.location.href = "/login";
  }

  // Basic front-end validation for NIC required fields on final submit
  function validateBeforeSubmit() {
    const required = {
      // Step 0
      applicantName: "Name of Applicant",
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      dob: "Date of Birth",
      religion: "Religion",
      gender: "Gender",
      handicapped: "Physically Handicapped (Yes/No)",
      // Step 1
      aadhar: "Aadhar Number",
      income: "Annual Income",
      nationality: "Nationality",
      maritalStatus: "Marital Status",
      // Step 2
      mobile: "Mobile Number",
      domicileBihar: "Are you domicile/native of Bihar?",
      residentialCert: "Residential Certificate",
      district: "District Name",
      address: "Address for Correspondence",
      permanentAddress: "Permanent Address",
      // Step 3
      choiceDistrict: "Choice of District (MSY)",
      jobRoleChoice: "Job Role",
      qualification: "Highest Educational Qualification",
      marksheet: "Marksheet of Highest Degree",
      prevTraining: "Previous Training (Yes/No)",
      // Step 4
      incomeCert: "Income Certificate",
      signature: "Upload Signature",
      photo: "Candidate Photo",
      selfDeclaration: "Self Declaration",
      place: "Place",
      date: "Date",
    };

    for (const key in required) {
      const val = form[key];
      if (
        val === "" ||
        val === null ||
        (key === "selfDeclaration" && !val)
      ) {
        return `${required[key]} is required.`;
      }
    }

    if (form.handicapped === "Yes" && !form.disabilityDegree.trim()) {
      return "Degree of Disability is required when Physically Handicapped is Yes.";
    }
    if (form.prevTraining === "Yes" && !form.prevTrainingDetails.trim()) {
      return "Please provide previous training details.";
    }
    return "";
  }

  async function submitApplication(e) {
    e.preventDefault();
    setMessage("");

    const err = validateBeforeSubmit();
    if (err) {
      setMessage(err);
      return;
    }

    try {
      const formData = new FormData();
     Object.entries(form).forEach(([k, v]) => {
  formData.append(k, v);
});

      await api("/applications", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      setMessage("Application submitted successfully.");
      loadApplications();
    } catch (e) {
      setMessage(e.message || "Submission failed.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto my-6 sm:my-10 bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="flex items-center gap-3">
          {me && (
            <div className="text-sm text-gray-700">
              Logged in as: <strong>{me.username || me.mobile}</strong>
            </div>
          )}
          
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-[11px] sm:text-xs md:text-sm font-medium mb-1">
          {steps.map((label, idx) => (
            <span
              key={label}
              className={idx === currentStep ? "text-blue-900" : "text-gray-500"}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-900 h-2 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={submitApplication}
        className="space-y-6 border border-gray-200 rounded-2xl p-4 sm:p-6"
      >
        {/* STEP 0 — Personal Information */}
        {currentStep === 0 && (
          <>
            <h3 className="text-lg font-semibold mb-1">
              1. Personal Information / व्यक्तिगत जानकारी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Name of Applicant / आवेदक का नाम*"
                required
                name="applicantName"
                value={form.applicantName}
                onChange={handleChange}
              />
              <Field
                label="Father's Name / पिता का नाम*"
                required
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
              />
              <Field
                label="Mother's Name / माता का नाम*"
                required
                name="motherName"
                value={form.motherName}
                onChange={handleChange}
              />
              <Field
                type="date"
                label="Date of Birth / जन्म तिथि*"
                required
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
              <Select
                label="Religion / धर्म*"
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
                label="Gender / लिंग*"
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
                label="Physically Handicapped / शारीरिक रूप से विकलांग*"
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
                  label="Degree of Disability / विकलांगता का विवरण"
                  name="disabilityDegree"
                  value={form.disabilityDegree}
                  onChange={handleChange}
                />
              )}
            </div>
          </>
        )}

        {/* STEP 1 — Additional Details */}
        {currentStep === 1 && (
          <>
            <h3 className="text-lg font-semibold mb-1">
              2. Additional Details / अतिरिक्त विवरण
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Aadhar Number / आधार संख्या*"
                required
                name="aadhar"
                value={form.aadhar}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={12}
              />
              <Field
                label="Annual Income / वार्षिक आय*"
                required
                name="income"
                value={form.income}
                onChange={handleChange}
                inputMode="numeric"
              />
              <FileField
                label="Income Certificate / आय प्रमाण पत्र*"
                required
                name="incomeCert"
                onChange={handleChange}
              />
              <Select
                label="Nationality / नागरिकता*"
                required
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                options={[
                  { v: "", l: "Select" },
                  { v: "Indian", l: "Indian / भारतीय" },
                  { v: "Non-Indian", l: "Non-Indian / ग़ैर भारतीय" },
                  { v: "Other", l: "Other" },
                ]}
              />
              <Select
                label="Marital Status / वैवाहिक स्थिति*"
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
          </>
        )}

        {/* STEP 2 — Contact & Address */}
        {currentStep === 2 && (
          <>
            <h3 className="text-lg font-semibold mb-1">
              3. Contact & Address / संपर्क और पता
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Email / ई-मेल" name="email" value={form.email} onChange={handleChange} />
              <Field
                label="Mobile Number / मोबाइल नंबर*"
                required
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                inputMode="tel"
              />
              <Field
                label="Telephone Number with STD Code / टेलीफोन नंबर"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                inputMode="tel"
              />

              <RadioGroup
                label="Are you a domicile/native of Bihar? / क्या आप बिहार राज्य के मूल निवासी हैं?*"
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
                label="Residential Certificate / आवासीय प्रमाण पत्र*"
                required
                name="residentialCert"
                onChange={handleChange}
              />

              <Field
                label="District Name / जिला का नाम*"
                required
                name="district"
                value={form.district}
                onChange={handleChange}
              />

              <TextArea
                label="Address for Correspondence / पत्राचार का पता*"
                required
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              <TextArea
                label="Permanent Address / स्थायी पता*"
                required
                name="permanentAddress"
                value={form.permanentAddress}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* STEP 3 — Education & Training */}
        {currentStep === 3 && (
          <>
            <h3 className="text-lg font-semibold mb-1">
              4. Education & Training / शिक्षा और प्रशिक्षण
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Choice of District (MSY) / कौशल प्रशिक्षण कार्यक्रम हेतु जिला का चुनाव*"
                required
                name="choiceDistrict"
                value={form.choiceDistrict}
                onChange={handleChange}
              />
              <Field
                label="Job Role / जॉब रोल*"
                required
                name="jobRoleChoice"
                value={form.jobRoleChoice}
                onChange={handleChange}
              />

              <Select
                label="Highest Educational Qualification / उच्चतम योग्यता*"
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
                label="Marksheet of Highest Degree / उच्चतम योग्यता की मार्कशीट*"
                required
                name="marksheet"
                onChange={handleChange}
              />

              <RadioGroup
                label="क्या आपने पहले बिहार राज्य अल्पसंख्यक वित्तीय निगम द्वारा प्रायोजित किसी कौशल विकास कार्यक्रम में प्रशिक्षण लिया है?*"
                required
                name="prevTraining"
                value={form.prevTraining}
                onChange={handleChange}
                options={[
                  { v: "Yes", l: "हाँ" },
                  { v: "No", l: "नहीं" },
                ]}
              />

              {form.prevTraining === "Yes" && (
                <TextArea
                  label="यदि हाँ, तो उसका विवरण अंकित करें"
                  name="prevTrainingDetails"
                  value={form.prevTrainingDetails}
                  onChange={handleChange}
                />
              )}
            </div>
          </>
        )}

        {/* STEP 4 — Uploads & Declaration */}
        {currentStep === 4 && (
          <>
            <h3 className="text-lg font-semibold mb-1">
              5. Uploads & Declaration / अपलोड और घोषणा
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileField
                label="Upload Signature*"
                required
                name="signature"
                onChange={handleChange}
              />
              <FileField
                label="Candidate Photo*"
                required
                name="photo"
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 border">
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
                    className="h-4 w-4"
                    aria-label="Self Declaration"
                  />
                  <span className="text-sm">
                    I agree / मैं सहमत हूँ
                  </span>
                </div>
              </div>

              <Field
                label="Place / स्थान*"
                required
                name="place"
                value={form.place}
                onChange={handleChange}
              />
              <Field
                type="date"
                label="Date / तिथि*"
                required
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200"
            >
              Previous
            </button>
          ) : (
            <span />
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-full"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-full"
            >
              Submit
            </button>
          )}
        </div>
      </form>

      {/* Applications list */}
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-3">My Applications</h3>
        <ul className="space-y-2">
          {applications.map((a) => (
            <li
              key={a.id}
              className="p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="font-semibold">{a.applicant_name}</div>
              <div className="text-xs text-gray-500">
                {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-xs text-gray-500">
          Helpdesk: 0612224975
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI helpers to keep code tidy ---------- */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  inputMode,
  maxLength,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, required = false }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
      >
        {options.map((o) => (
          <option key={o.l} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroup({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <div className="block text-sm font-medium text-gray-700">{label}</div>
      <div className="mt-2 flex flex-wrap gap-4">
        {options.map((o) => (
          <label key={o.v} className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={o.v}
              checked={value === o.v}
              onChange={onChange}
              required={required}
            />
            <span>{o.l}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FileField({ label, name, onChange, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full text-sm"
      />
    </div>
  );
}
