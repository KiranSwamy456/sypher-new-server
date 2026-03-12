"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use NextAuth signIn with credentials provider
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false, // Don't redirect automatically 
        callbackUrl: '/admin',
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        // Map error messages
        const errorMap = {
          'Email and password required': 'Please enter both email and password',
          'Invalid credentials': 'Invalid email or password',
          'Account inactive': 'Your account is inactive. Please contact support.',
          'Admin access required': 'You do not have admin access',
        };

        const errorMessage = errorMap[result.error] || result.error || 'Login failed';
        setError(errorMessage);
        alert(`❌ Login Failed\n\n${errorMessage}`);
      } else if (result?.ok) {
        // Login successful, redirect to admin
        console.log('Login successful, redirecting to /admin');
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="mb-3">
        <input
          type="email"
          name="email"
          className="form-control custom-input"
          placeholder="Username"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div className="mb-3 position-relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          className="form-control custom-input"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>        
      </div>

      {/* Remember + Forgot */}
      {/* <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
          />
          <label className="form-check-label small" htmlFor="rememberMe">
            Remember Me
          </label>
        </div>

        <a href="#" className="small text-muted">
          Password?
        </a>
      </div> */}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn login-btn w-100"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Signing In...
          </>
        ) : (
          "Login"
        )}
      </button>

    </form>
  );
};

export default LoginForm;
