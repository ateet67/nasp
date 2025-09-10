import { useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password && password === confirm) setDone(true)
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email and we will send you a link to Reset your password">
      {!done ? (
        <form onSubmit={onSubmit} className="auth-form">
          <div className="field">
            <label className="label">Email</label>
            <input className="input" placeholder="Enter your email" />
          </div>
          <div className="actions buttons-side-by-side">
            <button className="btn btn-secondary" type="button">Cancel</button>
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      ) : (
        <div className="success">Password updated.</div>
      )}
    </AuthLayout>
  )
}

