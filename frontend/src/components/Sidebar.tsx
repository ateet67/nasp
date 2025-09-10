import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  userRole: string
}

export default function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation()

  const menuItems = [
    { path: '/super-admin', label: 'Dashboard', icon: '📊' },
    { path: '/super-admin/users', label: 'User Management', icon: '👥' },
    { path: '/super-admin/schools', label: 'School Management', icon: '🏫' },
    { path: '/super-admin/students', label: 'Student Management', icon: '🎓' },
    { path: '/super-admin/content', label: 'Content Management', icon: '📚' },
    { path: '/super-admin/reports', label: 'Reports & Analytics', icon: '📈' },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">NASP</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
        
        <div className="nav-item logout">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </div>
      </nav>
    </div>
  )
}
