import React, { useState } from 'react';
import './SignIn.css'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { login as authServiceLogin } from '../../services/authService';

const SignIn = () => {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginDetails;
    try {
      const user = await authServiceLogin(email, password);
      login(user); // Update Auth context
      toast.success('User logged in successfully!');
      navigate('/profile'); // Redirect to the profile page
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const navigateToSignUp = () => {
    navigate('/signup'); 
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <form onSubmit={handleSubmit} className="signin-form">
          <h2>Sign In</h2>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" name="email" placeholder="Enter email"
                   value={loginDetails.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter password"
                   value={loginDetails.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button">Sign In</button>
          <div onClick={navigateToSignUp} className="forgot-password-link"><u>Don't have an account</u></div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
