// 404 Not Found component
import React from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container className="mt-5">
      <Alert variant="danger">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Button as={Link} to="/login" variant="primary">
          Go to Login
        </Button>
      </Alert>
    </Container>
  );
}

export default NotFound;
