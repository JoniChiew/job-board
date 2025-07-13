// Applicant dashboard component
import React, { useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { AppContext } from "../AppContext.js";
import { useNavigate } from "react-router-dom";

function ApplicantDashboard() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Container className="mt-5">
      <h2>Applicant Dashboard</h2>
      <p>Welcome, {user?.name || "Applicant"}!</p>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
      {/* Add job browsing UI later */}
    </Container>
  );
}

export default ApplicantDashboard;
