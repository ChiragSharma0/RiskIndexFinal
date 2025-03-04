import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import './index.css';
import App from './App';
import "leaflet/dist/leaflet.css";
import { AuthProvider } from './context/Authcontext';
import { LanguageProvider } from './context/TranslatorContext'
console.log("index.js running");
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);


root.render(
    <LanguageProvider>
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    </LanguageProvider>
);
