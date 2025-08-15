


DROP DATABASE IF EXISTS application_portal;


CREATE DATABASE application_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE application_portal;


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


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

   
    applicant_name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150) NOT NULL,
    mother_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    religion VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    handicapped ENUM('Yes', 'No') NOT NULL,
    disability_degree VARCHAR(100),

   
    aadhar VARCHAR(20) NOT NULL,
    income DECIMAL(12,2) NOT NULL,
    nationality ENUM('Indian', 'Non-Indian', 'Other') NOT NULL,
    marital_status ENUM('Married', 'Unmarried', 'Separated', 'Divorced') NOT NULL,


    email VARCHAR(120),
    mobile VARCHAR(20) NOT NULL,
    telephone VARCHAR(20),
    domicile_bihar ENUM('Yes', 'No') NOT NULL,
    residential_cert_path VARCHAR(255) NOT NULL,
    district VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,

    
    choice_district VARCHAR(150) NOT NULL,
    job_role_choice VARCHAR(150) NOT NULL,
    qualification ENUM(
        'Class 7 passed','Class 8 passed','Class 9 passed',
        'Class 10 passed','Class 11 passed','Class 12 passed',
        'Graduate or Higher'
    ) NOT NULL,
    marksheet_path VARCHAR(255) NOT NULL,
    previous_training ENUM('Yes', 'No') NOT NULL,
    previous_training_details TEXT,

   
    income_cert_path VARCHAR(255) NOT NULL,
    signature_path VARCHAR(255) NOT NULL,
    photo_path VARCHAR(255) NOT NULL,
    self_declaration TINYINT(1) NOT NULL DEFAULT 0,
    place VARCHAR(150) NOT NULL,
    application_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_app_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
