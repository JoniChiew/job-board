// Main app component with routing
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./AppContext.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Home from "./components/Home.js";
import EmployerDashboard from "./components/EmployerDashboard.js";
import ApplicantDashboard from "./components/ApplicantDashboard.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import NotFound from "./components/NotFound.js";
import ForgotPassword from "./components/ForgotPassword.js";
import ResetPassword from "./components/ResetPassword.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute role="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant/dashboard"
            element={
              <ProtectedRoute role="applicant">
                <ApplicantDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
