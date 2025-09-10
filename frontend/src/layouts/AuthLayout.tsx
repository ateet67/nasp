import { PropsWithChildren } from 'react'
import '../styles/auth.css'

export default function AuthLayout({ children, title, subtitle }: PropsWithChildren<{ title?: string; subtitle?: string }>) {
  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="logo">NASP</div>
            <div>
              <h1>CAP App NASP</h1>
              <div className="subtitle">Conservation Awareness Program</div>
            </div>
          </div>
          {title && <div className="auth-title">{title}</div>}
          {subtitle && <div className="auth-desc">{subtitle}</div>}
          {children}
        </div>
      </div>
      <div className="auth-right">
        {/* Bear image placeholder - in real implementation, this would be an actual image */}
      </div>
    </div>
  )
}

