import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getDbPool } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

export const applicationsRouter = Router();

// Create uploads directory if not exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// File fields to accept
const uploadFields = upload.fields([
  { name: "residentialCert" },
  { name: "marksheet" },
  { name: "incomeCert" },
  { name: "signature" },
  { name: "photo" }
]);

applicationsRouter.post("/", requireAuth, uploadFields, async (req, res, next) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    const {
      applicantName,
      fatherName,
      motherName,
      dob,
      religion,
      gender,
      handicapped,
      disabilityDegree,
      aadhar,
      income,
      nationality,
      maritalStatus,
      email,
      mobile,
      telephone,
      domicileBihar,
      district,
      address,
      permanentAddress,
      choiceDistrict,
      jobRoleChoice,
      qualification,
      previousTraining,
      previousTrainingDetails,
      selfDeclaration,
      place,
      date
    } = req.body;

    if (!applicantName) {
      return res.status(400).json({ error: "Applicant name is required" });
    }

    // Get file paths, ensuring they're null if not provided
    const residentialCertPath = req.files?.residentialCert?.[0]?.path || null;
    const marksheetPath = req.files?.marksheet?.[0]?.path || null;
    const incomeCertPath = req.files?.incomeCert?.[0]?.path || null;
    const signaturePath = req.files?.signature?.[0]?.path || null;
    const photoPath = req.files?.photo?.[0]?.path || null;

    // Helper function to convert empty strings to null
    const nullifyEmpty = (value) => {
      if (value === undefined || value === null || value === '' || value === 'null') {
        return null;
      }
      return value;
    };

    // Helper function to parse number or return null
    const parseNumber = (value) => {
      if (value === undefined || value === null || value === '' || value === 'null') {
        return null;
      }
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    // Helper function to format date
    const formatDate = (value) => {
      if (!value || value === 'null') return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    // Prepare values array with proper null handling and type conversion
    const values = [
      req.user.id,
      nullifyEmpty(applicantName),
      nullifyEmpty(fatherName),
      nullifyEmpty(motherName),
      formatDate(dob),
      nullifyEmpty(religion),
      nullifyEmpty(gender),
      nullifyEmpty(handicapped),
      nullifyEmpty(disabilityDegree),
      nullifyEmpty(aadhar),
      parseNumber(income),
      nullifyEmpty(nationality),
      nullifyEmpty(maritalStatus),
      nullifyEmpty(email),
      nullifyEmpty(mobile),
      nullifyEmpty(telephone),
      nullifyEmpty(domicileBihar),
      residentialCertPath,
      nullifyEmpty(district),
      nullifyEmpty(address),
      nullifyEmpty(permanentAddress),
      nullifyEmpty(choiceDistrict),
      nullifyEmpty(jobRoleChoice),
      nullifyEmpty(qualification),
      marksheetPath,
      nullifyEmpty(previousTraining),
      nullifyEmpty(previousTrainingDetails),
      incomeCertPath,
      signaturePath,
      photoPath,
      selfDeclaration === 'true' || selfDeclaration === true ? 1 : 0,
      nullifyEmpty(place),
      formatDate(date)
    ];

    console.log("Values to insert:", values);
    console.log("Values length:", values.length);

    const pool = getDbPool();
    const [result] = await pool.execute(
      `INSERT INTO applications (
        user_id, applicant_name, father_name, mother_name, dob, religion, gender, handicapped, disability_degree,
        aadhar, income, nationality, marital_status, email, mobile, telephone,
        domicile_bihar, residential_cert_path, district, address, permanent_address,
        choice_district, job_role_choice, qualification, marksheet_path, previous_training, previous_training_details,
        income_cert_path, signature_path, photo_path, self_declaration, place, application_date
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      values
    );

    res.json({ id: result.insertId, message: "Application submitted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    console.error("Error details:", {
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sql: err.sql
    });
    next(err);
  }
});

applicationsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const pool = getDbPool();
    const [rows] = await pool.execute(
      `SELECT * FROM applications WHERE user_id = ? ORDER BY id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});