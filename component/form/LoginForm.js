"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
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


return(
   <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      
      <div className="row">
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <button 
              type="submit" 
              className="common_btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
