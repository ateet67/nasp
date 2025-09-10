import './App.css'
import './styles/admin.css'
import './styles/admin-layout.css'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import SetPassword from './pages/auth/SetPassword'
import StudentSignup from './pages/auth/StudentSignup'
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import RegionalAdminDashboard from './pages/admin/RegionalAdminDashboard'
import TeacherDashboard from './pages/admin/TeacherDashboard'
import StudentDashboard from './pages/student/StudentDashboard'

const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: 24 }}>
    <h2>{title}</h2>
    <p>Coming soon...</p>
  </div>
)

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <nav style={{ display: 'flex', gap: 12, padding: 12, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Link to="/super-admin">Super Admin</Link>
        <Link to="/super-admin/users">User Management</Link>
        <Link to="/regional-admin">Regional Admin</Link>
        <Link to="/teacher">Teacher</Link>
        <Link to="/student">Student Portal</Link>
        <Link to="/auth/login">Login</Link>
        <Link to="/auth/signup">Student Signup</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/super-admin" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<StudentSignup />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />
        <Route path="/auth/reset" element={<ResetPassword />} />
        <Route path="/auth/set-password" element={<SetPassword />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/users" element={<SuperAdminDashboard />} />
        <Route path="/regional-admin" element={<RegionalAdminDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/super-admin/*" element={<Placeholder title="Super Admin Portal" />} />
        <Route path="/regional-admin/*" element={<Placeholder title="Regional Admin Portal" />} />
        <Route path="/teacher/*" element={<Placeholder title="Teacher Portal" />} />
        <Route path="/student/*" element={<Placeholder title="Student Portal" />} />
        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
