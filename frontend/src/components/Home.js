// frontend/src/components/Home.js
import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // Handle navigation to login page
  const handleLogin = () => {
    navigate("/login");
  };

  // Handle navigation to register page
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to Job Board</h1>
      <p>Find your dream job or post opportunities for talented applicants.</p>
      <div className="mt-4">
        <Button
          variant="primary"
          size="lg"
          className="me-3"
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button variant="success" size="lg" onClick={handleRegister}>
          Register
        </Button>
      </div>
    </Container>
  );
}

export default Home;
