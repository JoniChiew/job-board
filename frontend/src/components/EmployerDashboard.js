// frontend/src/components/EmployerDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Form, Table, Alert } from "react-bootstrap";
import { AppContext } from "../AppContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployerDashboard() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary_range: "",
    is_remote: false,
    status: "draft",
  });

  // Fetch jobs created by employer
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/jobs/employer",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setJobs(response.data.jobs);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Handle job creation
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/jobs",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setJobs([...jobs, response.data.job]);
      setFormData({
        title: "",
        description: "",
        location: "",
        salary_range: "",
        is_remote: false,
        status: "draft",
      });
    } catch (err) {
      // Handle validation errors
      if (err.response?.status === 422 && err.response?.data?.message) {
        const errors = err.response.data.message;
        const errorMessages =
          typeof errors === "object"
            ? Object.values(errors).flat().join(", ")
            : errors;
        setError(errorMessages || "Failed to create job");
      } else {
        setError(err.response?.data?.message || "Failed to create job");
      }
      console.error("Job creation error:", err.response?.data);
    }
  };

  // Handle job update
  const handleUpdateJob = async (jobId, updatedData) => {
    setError("");
    try {
      const response = await axios.put(
        `http://localhost:8000/api/jobs/${jobId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setJobs(jobs.map((job) => (job.id === jobId ? response.data.job : job)));
      alert("Job updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    setError("");
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:8000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setJobs(jobs.filter((job) => job.id !== jobId));
        alert("Job deleted successfully");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete job");
      }
    }
  };

  // Fetch applications for a job
  const viewApplications = async (jobId) => {
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/jobs/${jobId}/applications`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setApplications({ ...applications, [jobId]: response.data.applications });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
    }
  };

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
      <Button variant="danger" onClick={handleLogout} className="mb-3">
        Logout
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      <h3>Create New Job</h3>
      <Form onSubmit={handleCreateJob}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter job title"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter job description"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter job location"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="salary_range">
          <Form.Label>Salary Range</Form.Label>
          <Form.Control
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleInputChange}
            placeholder="Enter salary range (optional)"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="is_remote">
          <Form.Check
            type="checkbox"
            name="is_remote"
            label="Remote"
            checked={formData.is_remote}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="closed">Closed</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="filled">Filled</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Job
        </Button>
      </Form>

      <h3 className="mt-5">Your Jobs</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Status</th>
            <th>Posted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>
                <Form.Select
                  value={job.status}
                  onChange={(e) =>
                    handleUpdateJob(job.id, { status: e.target.value })
                  }
                >
                  <option value="closed">Closed</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="filled">Filled</option>
                </Form.Select>
              </td>
              <td>{new Date(job.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => viewApplications(job.id)}
                >
                  View Applications
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="ms-2"
                  onClick={() => {
                    const title = prompt("Enter new title", job.title);
                    const description = prompt(
                      "Enter new description",
                      job.description
                    );
                    if (title && description) {
                      handleUpdateJob(job.id, { title, description });
                    }
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleDeleteJob(job.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {Object.keys(applications).map((jobId) => (
        <div key={jobId} className="mt-3">
          <h4>Applications for Job ID: {jobId}</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Message</th>
                <th>Applied On</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {applications[jobId].map((app) => (
                <tr key={app.id}>
                  <td>{app.user.name}</td>
                  <td>{app.message || "N/A"}</td>
                  <td>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td>
                    {app.resume_url ? (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      "No resume"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </Container>
  );
}

export default EmployerDashboard;
