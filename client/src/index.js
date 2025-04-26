import './disableConsole';  // <-- import here FIRST


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";

import './i18n'; // <---- ✅ Import i18n setup
import './index.css';
import App from './App';
import "leaflet/dist/leaflet.css";

import { AuthProvider } from './context/Authcontext';

console.log("index.js running");

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);
