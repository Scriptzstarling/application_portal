# Application Portal

A full-stack web application for managing job training applications with OTP-based authentication, built with React frontend and Express.js backend.

## 🌟 Features

- **OTP Authentication**: Secure mobile number-based authentication using Twilio SMS
- **Application Management**: Complete application submission and tracking system
- **File Upload**: Support for document uploads (certificates, marksheets, photos, signatures)
- **Responsive Design**: Mobile-friendly interface built with TailwindCSS
- **Protected Routes**: Secure user authentication and route protection
- **Application Review**: Review and track application status
- **PDF Generation**: Generate PDF versions of applications
- **Real-time Notifications**: SMS notifications for application updates

## 🏗️ Project Structure

```
application-portal/
├── backend/                    # Express.js Backend
│   ├── .env                   # Environment variables
│   ├── package.json           # Backend dependencies
│   ├── sql/
│   │   └── schema.sql         # Database schema
│   ├── src/
│   │   ├── config.js          # Database and app configuration
│   │   ├── db.js              # Database connection
│   │   ├── server.js          # Express server entry point
│   │   ├── sms.js             # Twilio SMS service
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication middleware
│   │   └── routes/
│   │       ├── applications.js # Application CRUD operations
│   │       └── auth.js        # Authentication routes
│   └── uploads/               # File upload directory
└── frontend/                  # React Frontend
    ├── index.html             # HTML template
    ├── package.json           # Frontend dependencies
    ├── postcss.config.js      # PostCSS configuration
    ├── tailwind.config.js     # TailwindCSS configuration
    ├── vercel.json            # Vercel deployment config
    ├── vite.config.js         # Vite build configuration
    └── src/
        ├── App.jsx            # Main React component
        ├── index.css          # Global styles
        ├── main.jsx           # React entry point
        ├── components/
        │   ├── Footer.jsx     # Footer component
        │   ├── Navbar.jsx     # Navigation bar
        │   └── ProtectedRoute.jsx # Route protection component
        ├── lib/
        │   └── api.js         # API utility functions
        └── pages/
            ├── ApplicationTracker.jsx # Track application status
            ├── Dashboard.jsx          # User dashboard
            ├── Login.jsx              # Login page
            ├── Register.jsx           # Registration page
            ├── ReviewApplication.jsx  # Application review page
            └── ViewApplication.jsx    # View application details
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Twilio** - SMS service
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **html2canvas & jsPDF** - PDF generation
- **Classnames** - CSS class utilities

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Twilio Account (for SMS functionality)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd application-portal
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables:
# DB_HOST=localhost
# DB_USER=your_mysql_username
# DB_PASSWORD=your_mysql_password
# DB_NAME=application_portal
# JWT_SECRET=your_jwt_secret
# TWILIO_ACCOUNT_SID=your_twilio_account_sid
# TWILIO_AUTH_TOKEN=your_twilio_auth_token
# TWILIO_PHONE_NUMBER=your_twilio_phone_number
# PORT=5000

# Setup database
mysql -u your_username -p < sql/schema.sql

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🗄️ Database Schema

The application uses MySQL with the following main tables:

- **users**: User account information
- **otp_verifications**: OTP verification records
- **applications**: Job training application data

Key features of the schema:
- Mobile number-based user identification
- Comprehensive application form fields
- File path storage for uploaded documents
- Proper indexing for performance

## 🔐 Authentication Flow

1. User enters mobile number
2. OTP is sent via Twilio SMS
3. User verifies OTP
4. JWT token is generated for session management
5. Protected routes require valid JWT token

## 📱 Application Features

### User Registration & Login
- Mobile number-based registration
- OTP verification
- Secure JWT token authentication

### Application Submission
- Comprehensive application form
- File upload for required documents:
  - Residential certificate
  - Educational marksheet
  - Income certificate
  - Signature
  - Photograph

### Application Management
- View submitted applications
- Track application status
- Review application details
- Generate PDF reports

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to mobile
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/register` - Register new user

### Applications
- `POST /api/applications` - Submit new application
- `GET /api/applications` - Get user applications
- `GET /api/applications/:id` - Get specific application
- `PUT /api/applications/:id` - Update application

## 🚀 Deployment

### Frontend (Vercel)
The project includes `vercel.json` configuration for easy Vercel deployment:

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend
Deploy to any Node.js hosting service (Heroku, Railway, DigitalOcean, etc.)

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=application_portal
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact [your-email@example.com]

## 🔮 Future Enhancements

- Email notifications
- Admin dashboard
- Application status tracking
- Bulk application processing
- Advanced search and filtering
- Integration with external APIs
- Multi-language support

---

**Note**: Make sure to configure your Twilio account and MySQL database before running the application.
