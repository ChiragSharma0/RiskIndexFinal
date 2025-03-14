import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './input.css';
import axios from 'axios';
const url = process.env.REACT_APP_USER_REGISTER;
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [generalMessage, setGeneralMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate each field instantly
    switch (name) {
      case 'username':
        setErrors({ ...errors, username: value.length < 3 ? 'Username must be at least 3 characters.' : '' });
        break;
      case 'email':
        setErrors({ ...errors, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format.' });
        break;
      case 'password':
        setErrors({ ...errors, password: value.length < 6 ? 'Password must be at least 6 characters.' : '' });
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralMessage('');

    // Prevent submission if there are errors
    if (errors.username || errors.email || errors.password) {
      setGeneralMessage('Please fix validation errors before submitting.');
      return;
    }

    try {
      const response = await axios.post(`${url}`, formData);
      setGeneralMessage(response.data.message);
    } catch (error) {
      setGeneralMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="Authpage">
      <form className="form" onSubmit={handleSubmit}>

        {/* Username Field */}
        <div className="flex-column">
          <label>Username</label>
          <input type="text" name="username" className="input" placeholder="Enter your Username" value={formData.username} onChange={handleChange} />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        {/* Email Field */}
        <div className="flex-column">
          <label>Email</label>
          <input type="text" name="email" className="input" placeholder="Enter your Email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="flex-column">
          <label>Password</label>
          <input type="password" name="password" className="input" placeholder="Enter your Password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="button-submit">Sign Up</button>

        {/* General Message */}
        {generalMessage && <p className="success-message">{generalMessage}</p>}

        {/* Link to Login */}
        <p className="p">
          Already have an account? <Link to="/auth/login" className="span">Sign In</Link>
        </p>
      </form>
    </div>
  );
  
};

export default RegisterForm;
