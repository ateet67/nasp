import { useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <AuthLayout title="Forgot password" subtitle="Enter your email and we will send you a link to Reset your password">
      {!sent ? (
        <form onSubmit={onSubmit} className="auth-form">
          <div className="field">
            <label className="label">Email</label>
            <input className="input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="actions">
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      ) : (
        <div className="success">If the email exists, a reset link has been sent.</div>
      )}
    </AuthLayout>
  )
}

