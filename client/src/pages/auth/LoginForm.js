import React, { useEffect, useState } from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import axios from 'axios';
import './input.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();








  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    try {
      // Send login request to the API
      const response = await axios.post('http://localhost:5500/api/auth/login', {
        email,
        password,
      }, { withCredentials: true }); // ✅ Ensures cookies are sent & received



      // Show success message with username
      localStorage.setItem("userid", response.data.userid);
      localStorage.setItem("username", response.data.username);
      setMessage(response.data.message);
      window.location.href = "/home"; // Redirect & refresh

    } catch (error) {
      // Handle errors and show the error message
      setMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className='Authpage'>
      <form className="form" onSubmit={handleSubmit}>
        <div className='emailfeild'>
          <div className="flex-column">
            <label>Email</label>
          </div>
          <div className="inputForm">
            <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
              <g id="Layer_3" data-name="Layer 3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
              </g>
            </svg>
            <input
              type="text"
              className="input"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
          </div>
        </div>

        <div className='PasswordFeild'>
          <div className="flex-column">
            <label>Password</label>
          </div>
          <div className="inputForm">
            <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
              <path  />
            </svg>
            <input
              type="password"
              className="input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
          </div>
        </div>

        <div className="flex-row">
          <div><label>
            <input type="checkbox" />
            Remember me</label>
          </div>
          <span className="span">Forgot password?</span>
        </div>
        <button type="submit" className="button-submit">Sign In</button>

        {message && <p className="message">{message}</p>} {/* Display success/error message */}

        <p className="p">
          Don't have an account?{' '}
          <span className="span">
            <Link to="/auth/register">Sign Up</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
