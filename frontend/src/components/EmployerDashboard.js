// Employer dashboard component
import React, { useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { AppContext } from "../AppContext.js";
import { useNavigate } from "react-router-dom";

function EmployerDashboard() {
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
      <h2>Employer Dashboard</h2>
      <p>Welcome, {user?.name || "Employer"}!</p>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
      {/* Add job management UI later */}
    </Container>
  );
}

export default EmployerDashboard;
