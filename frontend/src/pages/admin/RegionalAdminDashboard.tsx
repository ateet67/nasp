import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface DashboardStats {
  totalTeachers: number
  totalSchools: number
  totalStudents: number
  pendingApprovals: number
  regionName: string
}

export default function RegionalAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalSchools: 0,
    totalStudents: 0,
    pendingApprovals: 0,
    regionName: 'Your Region',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        
        // Get user info to get region
        const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const user = await userRes.json()

        // Fetch stats for the region
        const [teachersRes, schoolsRes, studentsRes, pendingRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/users?role=TEACHER&limit=1`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/schools?limit=1`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/students?limit=1`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/students?approved=false&limit=1`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ])

        const [teachers, schools, students, pending] = await Promise.all([
          teachersRes.json(),
          schoolsRes.json(),
          studentsRes.json(),
          pendingRes.json(),
        ])

        setStats({
          totalTeachers: teachers.total || 0,
          totalSchools: schools.total || 0,
          totalStudents: students.total || 0,
          pendingApprovals: pending.total || 0,
          regionName: user.regionId || 'Your Region',
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Regional Admin Dashboard</h1>
        <p>Managing {stats.regionName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>{stats.totalTeachers}</h3>
            <p>Teachers</p>
          </div>
          <Link to="/regional-admin/teachers" className="stat-link">Manage</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <h3>{stats.totalSchools}</h3>
            <p>Schools</p>
          </div>
          <Link to="/regional-admin/schools" className="stat-link">Manage</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Students</p>
          </div>
          <Link to="/regional-admin/students" className="stat-link">Manage</Link>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
          <Link to="/regional-admin/students?approved=false" className="stat-link">Review</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/regional-admin/teachers/new" className="action-card">
            <div className="action-icon">👨‍🏫</div>
            <h3>Add Teacher</h3>
            <p>Create a new teacher account</p>
          </Link>

          <Link to="/regional-admin/schools/new" className="action-card">
            <div className="action-icon">🏫</div>
            <h3>Add School</h3>
            <p>Register a new school in your region</p>
          </Link>

          <Link to="/regional-admin/students/new" className="action-card">
            <div className="action-icon">🎓</div>
            <h3>Add Student</h3>
            <p>Register a new student</p>
          </Link>

          <Link to="/regional-admin/conservations" className="action-card">
            <div className="action-icon">🌿</div>
            <h3>View Conservations</h3>
            <p>Manage conservation programs</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
