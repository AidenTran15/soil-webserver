import React, { useState } from 'react';
import './Signup.css'; // Ensure this matches the actual file name exactly
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as authServiceRegister } from '../../services/authService';

const SignUp = () => {
  const [userDetails, setUserDetails] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userDetails.email.match(/\S+@\S+\.\S+/)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (userDetails.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await authServiceRegister(userDetails.username, userDetails.email, userDetails.password);
      toast.success('User registered successfully!');
      navigate('/signin');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigateToSignIn = () => {
    navigate('/signin'); 
  };

  return (
    <div className="signup-container">
      <div className="left-panel">
        <h1>Welcome Back!</h1>
        <p>To keep connected with us please login with your personal info</p>
        <button onClick={navigateToSignIn} className="panel-button">SIGN IN</button>
      </div>
      <div className="right-panel">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Create Account</h2>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={userDetails.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={userDetails.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={userDetails.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
