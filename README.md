# Conservation Awareness Program (CAP) - NASP

A comprehensive educational platform for conservation awareness with role-based access control for Super Admins, Regional Admins, Teachers, and Students.

## 🚀 Features Implemented

### ✅ Super Admin Features
- **Authentication**: Login, Forgot Password, Reset Password, Set Password
- **Profile Management**: Logged user profile management
- **Regions Management**: Complete CRUD operations for regions
- **Conservation Management**: CRUD with stage-based progression system
- **Items Management**: CRUD with images/videos carousel support
- **Assessment System**: MCQ-based assessments for Items and Conservation
- **School Management**: CRUD with pagination, search, import/export
- **User Management**: CRUD for Regional Admins and Teachers with role-based assignments
- **Student Management**: CRUD with approval workflow and pagination

### ✅ Regional Admin Features
- **Authentication**: Login, Forgot Password, Reset Password, Set Password
- **Profile Management**: Logged user profile management
- **Teacher Management**: CRUD with school assignment within region scope
- **School Management**: CRUD for schools within region scope
- **Student Management**: CRUD with school/teacher assignment within region scope

### ✅ Teacher Features
- **Authentication**: Login, Forgot Password, Reset Password, Set Password
- **Student Management**: View all assigned students with progress tracking
- **Progress Monitoring**: Detailed student progress in assessments

### ✅ Student Portal Features
- **Authentication**: Login, Signup, Forgot Password, Reset Password, Set Password
- **Dashboard**: Progress tracking, notifications, profile management
- **Conservation Exploration**: Stage-based learning with topic progression
- **Assessment System**: MCQ assessments with immediate feedback
- **Badge System**: Earn badges based on assessment performance
- **Progress Tracking**: Comprehensive tracking of learning progress

## 🏗️ System Architecture

### Backend (NestJS + MongoDB)
- **Authentication**: JWT-based authentication with role-based access control
- **Models**: User, Student, Region, School, Conservation, Topic, Item, Assessment, Badge, Notification
- **Controllers**: Comprehensive CRUD operations for all entities
- **Services**: Business logic for all operations
- **Guards**: JWT authentication and role-based authorization
- **DTOs**: Data transfer objects with validation

### Frontend (React + TypeScript)
- **Admin Dashboards**: Super Admin, Regional Admin, and Teacher dashboards
- **Student Portal**: Game-like interface for learning
- **Authentication**: Login/signup forms with role-based redirection
- **Responsive Design**: Modern UI with CSS Grid and Flexbox

## 🎯 Key Features

### Stage-Based Learning
- Students must complete topics in order within each conservation
- Previous topic completion unlocks the next topic
- Conservation final assessment requires all topics to be completed

### Badge System
- **Topic Completion Badges**: Earned when completing topic assessments
- **Conservation Completion Badges**: Earned when completing conservation assessments
- **Assessment Excellence Badges**: Earned for high scores (80%+)
- **Points System**: Each badge has associated points

### Progress Tracking
- Real-time progress tracking for students
- Detailed analytics for teachers and admins
- Comprehensive reporting system

### Notification System
- Student approval notifications
- Badge earned notifications
- Assessment completion notifications
- Conservation unlock notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` file in backend directory:
```
MONGODB_URI=mongodb://127.0.0.1:27017/cap_nasp
JWT_SECRET=your_jwt_secret_here
SEED_SUPER_ADMIN_EMAIL=admin@capnasp.local
SEED_SUPER_ADMIN_PASSWORD=ChangeMe123!
```

## 📱 User Roles & Access

### Super Admin
- Full system access
- Manage all regions, conservations, schools, users, and students
- Import/export functionality
- System-wide analytics

### Regional Admin
- Manage teachers, schools, and students within assigned region
- Approve student registrations
- View regional analytics

### Teacher
- Manage assigned students
- Track student progress
- Generate reports
- Add new students (requires approval)

### Student
- Access conservation learning materials
- Take assessments
- Earn badges
- Track personal progress
- View notifications

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - Student signup
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `POST /auth/set-password` - Set new password

### Student Portal
- `GET /student-portal/dashboard` - Student dashboard data
- `GET /student-portal/conservations` - Available conservations
- `GET /student-portal/conservations/:id/topics` - Topics for conservation
- `GET /student-portal/topics/:id/items` - Items for topic
- `GET /student-portal/topics/:id/assessment` - Topic assessment
- `GET /student-portal/conservations/:id/assessment` - Conservation assessment
- `POST /student-portal/assessments/submit` - Submit assessment

### Admin Endpoints
- `GET /regions` - List regions
- `POST /regions` - Create region
- `GET /conservations` - List conservations
- `POST /conservations` - Create conservation
- `GET /schools` - List schools
- `POST /schools` - Create school
- `GET /users` - List users
- `POST /users` - Create user
- `GET /students` - List students
- `POST /students` - Create student
- `PATCH /students/:id/approve` - Approve student

## 🎨 Frontend Routes

- `/super-admin` - Super Admin Dashboard
- `/regional-admin` - Regional Admin Dashboard
- `/teacher` - Teacher Dashboard
- `/student` - Student Portal Dashboard
- `/auth/login` - Login Page
- `/auth/signup` - Student Signup Page

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation with class-validator
- CORS configuration
- Protected routes

## 📊 Database Schema

### Core Models
- **User**: Authentication and role management
- **Student**: Student information and progress tracking
- **Region**: Geographic regions for conservation programs
- **School**: Educational institutions
- **Conservation**: Conservation programs with stage progression
- **Topic**: Topics within conservations
- **Item**: Learning materials with images/videos
- **Assessment**: MCQ assessments for topics and conservations
- **Badge**: Achievement badges
- **Notification**: System notifications

## 🚀 Deployment

The application is ready for deployment with:
- Backend API server
- Frontend React application
- MongoDB database
- Environment configuration

## 📝 License

This project is part of the Conservation Awareness Program (CAP) for NASP.

## 🤝 Contributing

This is a comprehensive educational platform implementation. All core features have been implemented according to the requirements.

---

**Status**: ✅ All requirements implemented and ready for use!
