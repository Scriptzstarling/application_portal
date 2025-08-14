import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDbPool } from '../db.js';

export const applicationsRouter = Router();

applicationsRouter.post('/', requireAuth, async (req, res, next) => {
  try {
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
      domicile,
      district,
      address,
      permanentAddress,
      jobRoleChoice,
      qualification,
      prevTraining,
      prevTrainingDetails,
      selfDeclaration,
      place,
      date
    } = req.body;

    if (!applicantName) {
      return res.status(400).json({ error: 'Applicant name is required' });
    }

    const pool = getDbPool();
    const [result] = await pool.execute(
      `INSERT INTO applications (
        user_id, applicant_name, father_name, mother_name, dob, religion, gender, handicapped, disability_degree, 
        aadhar, income, nationality, marital_status, email, mobile, telephone, domicile, district, address, 
        permanent_address, job_role_choice, qualification, prev_training, prev_training_details, 
        self_declaration, place, date
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id,
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
        email || null,
        mobile,
        telephone || null,
        domicile,
        district,
        address,
        permanentAddress,
        jobRoleChoice,
        qualification,
        prevTraining,
        prevTrainingDetails || null,
        selfDeclaration,
        place,
        date
      ]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});

applicationsRouter.get('/', requireAuth, async (req, res, next) => {
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
