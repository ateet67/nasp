import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAppDispatch } from "../../store/hooks";
import { useSignupMutation } from "../../store/api/apiSlice";
import {
  setCredentials,
  setError,
  clearError,
} from "../../store/slices/authSlice";

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    regionId: "",
    schoolId: "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [signupMutation, { isLoading: loading, error: mutationError }] =
    useSignupMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }

    try {
      const data = await signupMutation({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials({ user: data.user, token: data.accessToken }));
      alert("Account created successfully! Please wait for admin approval.");
      navigate("/student/dashboard");
    } catch (err: any) {
      dispatch(setError(err.message || "Signup failed"));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AuthLayout
      title="Join the Conservation Program"
      subtitle="Create your student account"
    >
      <form onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <label className="label">Full Name</label>
          <input
            className="input"
            placeholder="Enter your full name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="field">
          <label className="label">Confirm Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="field">
          <label className="label">Region (Optional)</label>
          <input
            className="input"
            placeholder="Region ID"
            name="regionId"
            value={formData.regionId}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label className="label">School (Optional)</label>
          <input
            className="input"
            placeholder="School ID"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
          />
        </div>

        {mutationError && (
          <div className="error">{mutationError.message ?? ""}</div>
        )}

        <div className="actions">
          <Link className="link" to="/auth/login">
            Already have an account? Login
          </Link>
          <button className="btn" disabled={loading} type="submit">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
