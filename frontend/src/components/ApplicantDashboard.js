// frontend/src/components/ApplicantDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Table, Alert, Form } from "react-bootstrap";
import { AppContext } from "../AppContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ApplicantDashboard() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState({});
  const [resumes, setResumes] = useState({});

  // Fetch published jobs and user's applications
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/jobs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setJobs(response.data.jobs);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch jobs");
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/applications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setApplications(response.data.applications);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applications");
      }
    };

    fetchJobs();
    fetchApplications();
  }, []);

  // Handle job application
  const handleApply = async (jobId) => {
    setError("");
    const formData = new FormData();
    formData.append("message", messages[jobId] || "");
    formData.append("resume", resumes[jobId]);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/jobs/${jobId}/apply`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages({ ...messages, [jobId]: "" });
      setResumes({ ...resumes, [jobId]: null });
      setApplications([...applications, response.data.application]);
      alert("Application submitted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    }
  };

  // Handle resume update
  const handleUpdateResume = async (applicationId, file) => {
    setError("");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/applications/${applicationId}/resume`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setApplications(
        applications.map((app) =>
          app.id === applicationId
            ? { ...app, resume: response.data.resume }
            : app
        )
      );
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update resume");
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
      <h2>Applicant Dashboard</h2>
      <p>Welcome, {user?.name || "Applicant"}!</p>
      <Button variant="danger" onClick={handleLogout} className="mb-3">
        Logout
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      <h3>Available Jobs</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Salary Range</th>
            <th>Remote</th>
            <th>Posted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const hasApplied = applications.some(
              (app) => app.job_id === job.id
            );
            const application = applications.find(
              (app) => app.job_id === job.id
            );
            return (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.salary_range || "N/A"}</td>
                <td>{job.is_remote ? "Yes" : "No"}</td>
                <td>{new Date(job.created_at).toLocaleDateString()}</td>
                <td>
                  {hasApplied ? (
                    <>
                      <p className="text-success">
                        Applied on{" "}
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            handleUpdateResume(
                              application.id,
                              e.target.files[0]
                            )
                          }
                        />
                      </Form.Group>
                      <Button variant="secondary" size="sm">
                        Update Resume
                      </Button>
                    </>
                  ) : (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="textarea"
                          value={messages[job.id] || ""}
                          onChange={(e) =>
                            setMessages({
                              ...messages,
                              [job.id]: e.target.value,
                            })
                          }
                          placeholder="Enter application message"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            setResumes({
                              ...resumes,
                              [job.id]: e.target.files[0],
                            })
                          }
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={() => handleApply(job.id)}
                        disabled={!messages[job.id] || !resumes[job.id]}
                      >
                        Apply
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default ApplicantDashboard;
