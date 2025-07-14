// frontend/src/components/Register.js
import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../AppContext.js";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("applicant");
  const [error, setError] = useState("");
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email || !password || !confirmPassword || !name) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call backend register API
      const response = await axios.post("http://localhost:8000/api/register", {
        email,
        password,
        password_confirmation: confirmPassword, // Add password_confirmation
        role,
        name,
      });

      // Store token and user data
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser({ ...user, token });

      // Redirect based on role
      navigate(
        user.role === "employer"
          ? "/employer/dashboard"
          : "/applicant/dashboard"
      );
    } catch (err) {
      // Handle validation errors
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        setError(errorMessages || "Registration failed");
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </Form.Group>
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
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="applicant">Applicant</option>
            <option value="employer">Employer</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
        <p className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Form>
    </Container>
  );
}

export default Register;
