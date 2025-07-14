// frontend/src/components/ForgotPassword.js
import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    console.log("Sending reset password request for email:", email); // Debug log

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/forgot-password",
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Reset password response:", response.data); // Debug log
      setMessage(
        response.data.message || "Password reset link sent successfully"
      );
    } catch (err) {
      console.error("Reset password error:", err.response?.data); // Debug log
      setError(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Forgot Password</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send Reset Link
        </Button>
        <p className="mt-3">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </Form>
    </Container>
  );
}

export default ForgotPassword;
