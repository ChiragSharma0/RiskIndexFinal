import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './input.css';
import axios from 'axios';

const url = process.env.REACT_APP_USER_REGISTER;

const RegisterForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [generalMessage, setGeneralMessage] = useState('');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [reloadNeeded, setReloadNeeded] = useState(false);

  // 🔵 Restore saved form data if exists
  useEffect(() => {
    const savedData = localStorage.getItem("savedFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
      localStorage.removeItem("savedFormData"); // optional: auto clean
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    switch (name) {
      case 'username':
        setErrors(prev => ({ ...prev, username: value.length < 3 ? 'Username must be at least 3 characters.' : '' }));
        break;
      case 'email':
        setErrors(prev => ({ ...prev, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format.' }));
        break;
      case 'password':
        setErrors(prev => ({ ...prev, password: value.length < 6 ? 'Password must be at least 6 characters.' : '' }));
        break;
      default:
        break;
    }
  };

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      alert('Your browser does not support location access.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Location access granted!", position);
        setLocationPermissionGranted(true);
        setShowLocationPopup(false);
      },
      (error) => {
        console.error("❌ Location access denied or error", error);
        setLocationPermissionGranted(false);
        setShowLocationPopup(false);

        retryperms();
      }
    );
  };

  const retryperms = () => {
    console.log("triggered retry");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Location access granted!", position);
        setLocationPermissionGranted(true);
        setShowLocationPopup(false);
        setReloadNeeded(true); // if user manually allowed later, show reload modal

      },
      (error) => {
        console.error("❌ Location access denied or error", error);
        setLocationPermissionGranted(false);
        setShowLocationPopup(true);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralMessage('');

    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
      return;
    }

    if (!locationPermissionGranted) {
      setShowLocationPopup(true);
      return;
    }

    if (errors.username || errors.email || errors.password) {
      setGeneralMessage('Please fix validation errors before submitting.');
      return;
    }

    try {
      const response = await axios.post(`${url}`, formData);
      localStorage.setItem("userid", response.data.userid);
      setGeneralMessage(response.data.message);
      console.log("data:", response);

      setTimeout(() => {
        setGeneralMessage("Logging in ........");
      }, 1000);

      navigate('/home');
      localStorage.removeItem("savedFormData"); // 🔥 clear saved form after success
      window.location.reload();

    } catch (error) {
      setGeneralMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleDisclaimerAccept = () => {
    if (!disclaimerAccepted) {
      alert('Please check the box to accept the disclaimer.');
      return;
    }
    setShowDisclaimer(false);
    requestLocationPermission();
  };

  return (
    <div className="Authpage">

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Disclaimer</h2>
            <div className="disclaimer-content">

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{width:"50%"}}>
                  <h3>Prototype Information:</h3>

                  <p >

                    This is a prototype website intended for use from 10th June 2024, 17:30 IST to 16th June 2024, 05:30 IST.
                  </p>
                </div>
                <div style={{width:"50%"}}>
                  <h3>Medical Disclaimer:</h3>
                  <p >

                    The authors do not provide medical advice or recommendations. If you experience any medical issues or concerns, we strongly recommend that you consult a qualified healthcare professional.

                  </p>
                </div>
              </div>
            </div>
            <p>By Checking this box, you agree to terms and allow location access for better service personalization.</p>

            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="acceptDisclaimer"
                checked={disclaimerAccepted}
                onChange={() => setDisclaimerAccepted(!disclaimerAccepted)}
              />
              <label htmlFor="acceptDisclaimer">I agree to the disclaimer</label>
            </div>
            <button className="button-submit" onClick={handleDisclaimerAccept}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Location Permission Retry Modal */}
      {showLocationPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Location Access Needed</h2>
            <div className="disclaimer-content">
              <p>We need your location permission to proceed.</p>
              <p>Please allow location access from your browser settings if blocked.</p>
            </div>
            <button className="button-submit" onClick={retryperms}>
              Retry Location Access
            </button>
          </div>
        </div>
      )}

      {/* Reload Needed Modal */}
      {reloadNeeded && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Location Permission Updated!</h2>
            <div className="disclaimer-content">
              <p>We detected a permission change. Please reload the page to continue.</p>
            </div>
            <button className="button-submit" onClick={() => {
              localStorage.setItem("savedFormData", JSON.stringify(formData));
              window.location.reload();
            }}>
              Reload Now
            </button>
          </div>
        </div>
      )}

      {/* Register Form */}
      <form className="form" onSubmit={handleSubmit}>
        <div className="flex-column">
          <label>Username</label>
          <input
            type="text"
            name="username"
            className="input"
            placeholder="Enter your Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        <div className="flex-column">
          <label>Email</label>
          <input
            type="text"
            name="email"
            className="input"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="flex-column">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="input"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button type="submit" className="button-submit">Sign Up</button>

        {generalMessage && <p className="success-message">{generalMessage}</p>}

        <p className="p">
          Already have an account? <Link to="/auth/login" className="span">Sign In</Link>
        </p>
      </form>

    </div>
  );
};

export default RegisterForm;
