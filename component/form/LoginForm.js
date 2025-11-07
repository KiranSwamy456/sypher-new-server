"use client";
import { useState } from 'react';
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await fetch('/api/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData)
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       console.log('Login successful, user data:', data.user);
  //       console.log('Role code:', data.user.roleCode);
  //       localStorage.setItem('user', JSON.stringify(data.user));
        
  //       // Only allow admin access
  //       if (data.user.roleCode === 602) {
  //           console.log('Attempting redirect to /admin');
  //           router.push('/admin');
  //           // Force page refresh to ensure AuthContext picks up the user
  //           setTimeout(() => {
  //             window.location.reload();
  //           }, 100);
  //         }else {
  //           setError('Access denied. Admin privileges required.');
  //           return;
  //         }
  //     } else {
  //       setError(data.error || 'Login failed');
  //     }
  //   } catch (error) {
  //     setError('Network error. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful, user data:', data.user);
      console.log('Role code:', data.user.roleCode);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Allow admin (602), super admin (603) access to panel
      if ([602, 603].includes(data.user.roleCode)) {
        console.log('Attempting redirect to /admin');
        // Use window.location.href for immediate redirect instead of router.push + reload
        window.location.href = '/admin';
      } else {
        // Show specific error message based on role
        const roleMessages = {
          601: 'Regular users cannot access admin panel.',
          604: 'Invoice users cannot access admin panel.'
        };
        const errorMsg = roleMessages[data.user.roleCode] || 'Access denied. Admin privileges required.';
        setError(errorMsg);
        return;
      }
    } else {
      setError(data.error || 'Login failed');
    }
  } catch (error) {
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
