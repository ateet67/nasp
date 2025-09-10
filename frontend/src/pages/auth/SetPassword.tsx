import { useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password && password === confirm) setDone(true)
  }

  return (
    <AuthLayout title="Set Password" subtitle="Enter your password">
      {!done ? (
        <form onSubmit={onSubmit} className="auth-form">
          <div className="field">
            <label className="label">Password</label>
            <div className="password-field">
              <input className="input" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="password-toggle">👁️</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Confirm Password</label>
            <div className="password-field">
              <input className="input" placeholder="Confirm your password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <button type="button" className="password-toggle">👁️</button>
            </div>
          </div>
          <div className="actions">
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      ) : (
        <div className="success">Password set.</div>
      )}
    </AuthLayout>
  )
}

