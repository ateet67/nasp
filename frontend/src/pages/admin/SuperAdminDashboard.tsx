import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserManagement from "../../components/UserManagement";

interface DashboardStats {
  totalRegions: number;
  totalConservations: number;
  totalSchools: number;
  totalUsers: number;
  totalStudents: number;
  pendingApprovals: number;
}

export default function SuperAdminDashboard() {
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats>({
    totalRegions: 0,
    totalConservations: 0,
    totalSchools: 0,
    totalUsers: 0,
    totalStudents: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const [
          regionsRes,
          conservationsRes,
          schoolsRes,
          usersRes,
          studentsRes,
        ] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/regions?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/conservations?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/schools?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/users?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/students?limit=1&approved=false`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const [regions, conservations, schools, users, students] =
          await Promise.all([
            regionsRes.json(),
            conservationsRes.json(),
            schoolsRes.json(),
            usersRes.json(),
            studentsRes.json(),
          ]);

        setStats({
          totalRegions: regions.total || 0,
          totalConservations: conservations.total || 0,
          totalSchools: schools.total || 0,
          totalUsers: users.total || 0,
          totalStudents: students.total || 0,
          pendingApprovals: students.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  // If we're on the users route, show UserManagement component
  if (location.pathname === "/super-admin/users") {
    return <UserManagement />;
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Manage the entire Conservation Awareness Program</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <h3>{stats.totalRegions}</h3>
            <p>Regions</p>
          </div>
          <Link to="/super-admin/regions" className="stat-link">
            Manage
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌿</div>
          <div className="stat-content">
            <h3>{stats.totalConservations}</h3>
            <p>Conservations</p>
          </div>
          <Link to="/super-admin/conservations" className="stat-link">
            Manage
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <h3>{stats.totalSchools}</h3>
            <p>Schools</p>
          </div>
          <Link to="/super-admin/schools" className="stat-link">
            Manage
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Users</p>
          </div>
          <Link to="/super-admin/users" className="stat-link">
            Manage
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Students</p>
          </div>
          <Link to="/super-admin/students" className="stat-link">
            Manage
          </Link>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
          <Link to="/super-admin/students?approved=false" className="stat-link">
            Review
          </Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/super-admin/regions/new" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add New Region</h3>
            <p>Create a new region for conservation programs</p>
          </Link>

          <Link to="/super-admin/conservations/new" className="action-card">
            <div className="action-icon">🌱</div>
            <h3>Add Conservation</h3>
            <p>Create a new conservation program</p>
          </Link>

          <Link to="/super-admin/schools/new" className="action-card">
            <div className="action-icon">🏫</div>
            <h3>Add School</h3>
            <p>Register a new school</p>
          </Link>

          <Link to="/super-admin/users/new" className="action-card">
            <div className="action-icon">👤</div>
            <h3>Add User</h3>
            <p>Create a new admin or teacher account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
