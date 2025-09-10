import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useAppDispatch } from '../../store/hooks'
import { useLoginMutation } from '../../store/api/apiSlice'
import { setCredentials, setError, clearError } from '../../store/slices/authSlice'

export default function Login() {
  const [email, setEmail] = useState('admin@capnasp.local')
  const [password, setPassword] = useState('ChangeMe123!')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [loginMutation, { isLoading: loading, error: mutationError }] = useLoginMutation()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    
    try {
      const data = await loginMutation({ email, password }).unwrap()
      dispatch(setCredentials({ user: data.user, token: data.accessToken }))
      
      // Redirect based on user role
      const role = data.user?.role
      switch (role) {
        case 'SUPER_ADMIN':
          navigate('/super-admin')
          break
        case 'REGIONAL_ADMIN':
          navigate('/regional-admin')
          break
        case 'TEACHER':
          navigate('/teacher')
          break
        case 'STUDENT':
          navigate('/student')
          break
        default:
          navigate('/super-admin')
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Login failed'))
    }
  }

  return (
    <AuthLayout title="Super Admin Login" subtitle="Enter your account details">
      <form onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <label className="label">Email Address</label>
          <input className="input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="password-field">
            <input className="input" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="password-toggle">👁️</button>
          </div>
        </div>
            {mutationError && <div className="error">Login failed. Please check your credentials.</div>}
        <div className="actions">
          <Link className="link" to="/auth/forgot">Forgot Password</Link>
          <button className="btn" disabled={loading} type="submit">{loading ? 'Logging in...' : 'Login'}</button>
        </div>
      </form>
    </AuthLayout>
  )
}

