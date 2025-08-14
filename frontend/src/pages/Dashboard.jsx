import React, { useEffect, useState } from "react";
import { api, getToken, clearToken } from "../lib/api";

const steps = [
  "Personal Information",
  "Additional Details",
  "Contact & Address",
  "Education & Training",
  "Uploads & Declaration",
];

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
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
    email: "",
    mobile: "",
    telephone: "",
    domicile: "",
    district: "",
    address: "",
    permanentAddress: "",
    jobRoleChoice: "",
    qualification: "",
    prevTraining: "",
    prevTrainingDetails: "",
    selfDeclaration: false,
    place: "",
    date: "",
    incomeCert: null,
    residentialCert: null,
    marksheet: null,
    signature: null,
    photo: null,
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
      setMessage(e.message);
    }
  }

  async function loadApplications() {
    try {
      const list = await api("/applications", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setApplications(list);
    } catch (e) {
      setMessage(e.message);
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
          ? files[0]
          : value,
    }));
  }

  async function submitApplication(e) {
    e.preventDefault();
    setMessage("");
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      await api("/applications", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      setMessage("Application submitted successfully");
      loadApplications();
    } catch (e) {
      setMessage(e.message);
    }
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

  return (
    <div className="max-w-5xl mx-auto my-6 sm:my-10 bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        {me && (
          <div className="text-sm text-gray-700">
            Logged in as: <strong>{me.username || me.mobile}</strong>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-sm font-medium mb-1">
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
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

     {/* Form */}
<form
  onSubmit={submitApplication}
  className="space-y-6 border border-gray-200 rounded-2xl p-4 sm:p-6"
>
  {currentStep === 0 && (
    <>
      <h3 className="text-lg font-semibold mb-1">
        1. Personal Information
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Provide your basic identification details as per your official documents.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Middle Name (Optional)
          </label>
          <input
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={form.maritalStatus}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option>Married</option>
            <option>Unmarried</option>
            <option>Separated</option>
            <option>Divorced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nationality
          </label>
          <input
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Place of Birth
          </label>
          <input
            name="placeOfBirth"
            value={form.placeOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  )}

  {currentStep === 1 && (
    <>
      <h3 className="text-lg font-semibold mb-1">2. Additional Details</h3>
      <p className="text-sm text-gray-500 mb-4">Socio-economic and identity information.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Religion</label>
          <input name="religion" value={form.religion} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="handicapped" checked={!!form.handicapped} onChange={handleChange} />
          <label className="text-sm">Physically Handicapped</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Disability Degree</label>
          <input name="disabilityDegree" value={form.disabilityDegree} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Aadhar</label>
          <input name="aadhar" value={form.aadhar} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Income</label>
          <input name="income" value={form.income} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nationality</label>
          <input name="nationality" value={form.nationality} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <input name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </>
  )}

  {currentStep === 2 && (
    <>
      <h3 className="text-lg font-semibold mb-1">3. Contact & Address</h3>
      <p className="text-sm text-gray-500 mb-4">How we can reach you and where you live.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telephone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Domicile</label>
          <input name="domicile" value={form.domicile} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">District</label>
          <input name="district" value={form.district} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
          <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </>
  )}

  {currentStep === 3 && (
    <>
      <h3 className="text-lg font-semibold mb-1">4. Education & Training</h3>
      <p className="text-sm text-gray-500 mb-4">Your qualifications and prior trainings.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Job Role</label>
          <input name="jobRoleChoice" value={form.jobRoleChoice} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
          <input name="qualification" value={form.qualification} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="prevTraining" checked={!!form.prevTraining} onChange={handleChange} />
          <label className="text-sm">Previously Trained</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Previous Training Details</label>
          <textarea name="prevTrainingDetails" value={form.prevTrainingDetails} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </>
  )}

  {currentStep === 4 && (
    <>
      <h3 className="text-lg font-semibold mb-1">5. Uploads & Declaration</h3>
      <p className="text-sm text-gray-500 mb-4">Upload required documents and confirm the declaration.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Income Certificate</label>
          <input type="file" name="incomeCert" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Residential Certificate</label>
          <input type="file" name="residentialCert" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Marksheet</label>
          <input type="file" name="marksheet" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Signature</label>
          <input type="file" name="signature" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <input type="file" name="photo" onChange={handleChange} />
        </div>
        <div className="flex items-center gap-3 md:col-span-2">
          <input type="checkbox" name="selfDeclaration" checked={!!form.selfDeclaration} onChange={handleChange} />
          <label className="text-sm">I hereby declare that the information provided is true.</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Place</label>
          <input name="place" value={form.place} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>
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
      <span></span>
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
                {new Date(a.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
