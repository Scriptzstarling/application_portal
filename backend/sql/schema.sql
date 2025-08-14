-- Delete the entire database if it exists
DROP DATABASE IF EXISTS application_portal;

-- Create the database again
CREATE DATABASE application_portal;

-- Select the database to use
USE application_portal;

-- Create OTP Verifications table
CREATE TABLE otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    verified TINYINT(1) DEFAULT 0,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_mobile (mobile),
    INDEX idx_otp_verified_expires (verified, expires_at)
);

-- Create Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Applications table (full structure)
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    -- Personal Information
    applicant_name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150),
    mother_name VARCHAR(150),
    dob DATE,
    religion VARCHAR(100),
    gender VARCHAR(50),
    handicapped TINYINT(1) DEFAULT 0,
    disability_degree VARCHAR(50),

    -- Identity / Socio-economic
    aadhar VARCHAR(20),
    income DECIMAL(12,2),
    nationality VARCHAR(100),
    marital_status VARCHAR(50),

    -- Contact
    email VARCHAR(120),
    mobile VARCHAR(20),
    telephone VARCHAR(20),

    -- Address
    domicile VARCHAR(150),
    district VARCHAR(150),
    address TEXT,
    permanent_address TEXT,

    -- Education / Training
    job_role_choice VARCHAR(150),
    qualification VARCHAR(150),
    previous_training TINYINT(1) DEFAULT 0,
    previous_training_details TEXT,

    -- Declaration
    self_declaration TINYINT(1) DEFAULT 0,
    place VARCHAR(150),
    form_date DATE,

    -- File uploads (store file paths/URLs)
    income_cert_path VARCHAR(255),
    residential_cert_path VARCHAR(255),
    marksheet_path VARCHAR(255),
    signature_path VARCHAR(255),
    photo_path VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_app_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
