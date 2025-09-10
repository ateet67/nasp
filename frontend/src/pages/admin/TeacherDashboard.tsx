import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  completedAssessments: number
  averageScore: number
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    completedAssessments: 0,
    averageScore: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        
        // Get students assigned to this teacher
        const studentsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/students?limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const students = await studentsRes.json()

        // Calculate stats from student data
        const totalStudents = students.total || 0
        const activeStudents = students.items?.filter((s: any) => s.approved).length || 0
        
        // Calculate assessment stats
        let completedAssessments = 0
        let totalScore = 0
        let assessmentCount = 0

        students.items?.forEach((student: any) => {
          const progress = student.progress || {}
          Object.keys(progress).forEach(key => {
            if (key.startsWith('assessment_')) {
              const assessment = progress[key]
              if (assessment.score !== undefined) {
                completedAssessments++
                totalScore += assessment.score
                assessmentCount++
              }
            }
          })
        })

        const averageScore = assessmentCount > 0 ? Math.round((totalScore / assessmentCount) * 100) / 100 : 0

        setStats({
          totalStudents,
          activeStudents,
          completedAssessments,
          averageScore,
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
        <h1>Teacher Dashboard</h1>
        <p>Manage your students and track their progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
          <Link to="/teacher/students" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.activeStudents}</h3>
            <p>Active Students</p>
          </div>
          <Link to="/teacher/students?approved=true" className="stat-link">View Active</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.completedAssessments}</h3>
            <p>Completed Assessments</p>
          </div>
          <Link to="/teacher/progress" className="stat-link">View Progress</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.averageScore}%</h3>
            <p>Average Score</p>
          </div>
          <Link to="/teacher/analytics" className="stat-link">View Analytics</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/teacher/students/new" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add Student</h3>
            <p>Register a new student</p>
          </Link>

          <Link to="/teacher/students" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Manage Students</h3>
            <p>View and manage your students</p>
          </Link>

          <Link to="/teacher/progress" className="action-card">
            <div className="action-icon">📈</div>
            <h3>Track Progress</h3>
            <p>Monitor student learning progress</p>
          </Link>

          <Link to="/teacher/reports" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Generate Reports</h3>
            <p>Create progress reports</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
