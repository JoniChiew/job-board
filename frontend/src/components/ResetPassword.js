// frontend/src/components/ResetPassword.js
import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password || !passwordConfirmation) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/reset-password",
        {
          email,
          password,
          password_confirmation: passwordConfirmation,
          token: searchParams.get("token"),
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Reset password response:", response.data); // Debug log
      setMessage(response.data.message || "Password reset successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Reset password error:", err.response?.data || err.message); // Debug log
      setError(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Reset Password</h2>
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
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="passwordConfirmation">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Reset Password
        </Button>
        <p className="mt-3">
          Return to <Link to="/login">Login</Link>
        </p>
      </Form>
    </Container>
  );
}

export default ResetPassword;
