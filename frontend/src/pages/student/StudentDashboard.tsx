import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useGetStudentDashboardQuery } from '../../store/api/apiSlice'
import { setDashboardData, setLoading, setError } from '../../store/slices/studentSlice'
import { selectStudentLoading, selectStudentError } from '../../store/slices/studentSlice'

interface Conservation {
  _id: string
  title: string
  description: string
  progress: {
    completedTopics: number
    totalTopics: number
    eligibleForFinal: boolean
  }
}

interface Achievement {
  assessmentId: string
  score: number
  total: number
  at: string
}

interface DashboardData {
  student: any
  conservations: Conservation[]
  achievements: Achievement[]
  totalProgress: {
    completedAssessments: number
    totalConservations: number
    completedConservations: number
  }
}

export default function StudentDashboard() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectStudentLoading)
  const error = useAppSelector(selectStudentError)
  
  const { data, isLoading, error: queryError } = useGetStudentDashboardQuery()

  useEffect(() => {
    if (data) {
      dispatch(setDashboardData(data))
      dispatch(setLoading(false))
    } else if (queryError) {
      dispatch(setError('Failed to fetch dashboard data'))
      dispatch(setLoading(false))
    } else if (isLoading) {
      dispatch(setLoading(true))
    }
  }, [data, isLoading, queryError, dispatch])

  if (loading || isLoading) {
    return <div className="loading">Loading your dashboard...</div>
  }

  if (error || queryError) {
    return <div className="error">Failed to load dashboard data</div>
  }

  if (!data) {
    return <div className="error">No dashboard data available</div>
  }

  const { student, conservations, achievements, totalProgress } = data

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {student.fullName}!</h1>
        <p>Continue your conservation learning journey</p>
      </div>

      <div className="progress-overview">
        <div className="progress-card">
          <div className="progress-icon">🎯</div>
          <div className="progress-content">
            <h3>{totalProgress.completedAssessments}</h3>
            <p>Assessments Completed</p>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-icon">🌿</div>
          <div className="progress-content">
            <h3>{totalProgress.completedConservations}/{totalProgress.totalConservations}</h3>
            <p>Conservations Completed</p>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-icon">🏆</div>
          <div className="progress-content">
            <h3>{achievements.length}</h3>
            <p>Badges Earned</p>
          </div>
        </div>
      </div>

      <div className="conservations-section">
        <h2>Your Conservations</h2>
        <div className="conservations-grid">
          {conservations.map((conservation) => {
            const progressPercentage = conservation.progress.totalTopics > 0 
              ? Math.round((conservation.progress.completedTopics / conservation.progress.totalTopics) * 100)
              : 0

            return (
              <div key={conservation._id} className="conservation-card">
                <div className="conservation-header">
                  <h3>{conservation.title}</h3>
                  <div className="progress-badge">
                    {progressPercentage}%
                  </div>
                </div>
                <p className="conservation-description">{conservation.description}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="conservation-stats">
                  <span>{conservation.progress.completedTopics}/{conservation.progress.totalTopics} topics completed</span>
                </div>
                <div className="conservation-actions">
                  <Link 
                    to={`/student/conservations/${conservation._id}`}
                    className="btn btn-primary"
                  >
                    {conservation.progress.eligibleForFinal ? 'Take Final Assessment' : 'Continue Learning'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="achievements-section">
          <h2>Recent Achievements</h2>
          <div className="achievements-grid">
            {achievements.slice(0, 5).map((achievement, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">🏆</div>
                <div className="achievement-content">
                  <h4>Assessment Completed!</h4>
                  <p>Score: {achievement.score}/{achievement.total}</p>
                  <small>{new Date(achievement.at).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/student/conservations" className="action-card">
            <div className="action-icon">🌿</div>
            <h3>Explore Conservations</h3>
            <p>Continue learning about conservation</p>
          </Link>

          <Link to="/student/badges" className="action-card">
            <div className="action-icon">🏆</div>
            <h3>View Badges</h3>
            <p>See your earned achievements</p>
          </Link>

          <Link to="/student/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your profile information</p>
          </Link>

          <Link to="/student/notifications" className="action-card">
            <div className="action-icon">🔔</div>
            <h3>Notifications</h3>
            <p>Check your latest updates</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
