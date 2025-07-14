// frontend/src/components/ApplicantDashboard.js
import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Button,
  Table,
  Alert,
  Form,
  OverlayTrigger,
  Tooltip,
  Pagination,
} from "react-bootstrap";
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
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

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
    console.log("Apply button clicked for jobId:", jobId);
    setError("");
    const formData = new FormData();
    formData.append("message", messages[jobId] || "");
    formData.append("resume", resumes[jobId]);

    try {
      console.log("Sending apply request:", {
        jobId,
        message: messages[jobId],
        resume: resumes[jobId]?.name,
      });
      const response = await axios.post(
        `http://localhost:8000/api/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Apply response:", response.data);
      setMessages({ ...messages, [jobId]: "" });
      setResumes({ ...resumes, [jobId]: null });
      setApplications([...applications, response.data.application]);
      alert("Application submitted successfully");
    } catch (err) {
      console.error("Apply error:", err.response?.data);
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
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

  // Merge jobs and applications to display applied jobs and active unapplied jobs
  const displayedJobs = [
    ...applications.map((app) => ({
      ...app.job,
      application: app,
    })),
    ...jobs.filter((job) => !applications.some((app) => app.job_id === job.id)),
  ];

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = displayedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(displayedJobs.length / jobsPerPage);

  // Render tooltip for disabled Apply button
  const renderTooltip = (jobId) => (
    <Tooltip id={`tooltip-${jobId}`}>
      {!messages[jobId] && !resumes[jobId]
        ? "Please enter a message and select a PDF file."
        : !messages[jobId]
        ? "Please enter an application message."
        : !resumes[jobId]
        ? "Please select a PDF file."
        : ""}
    </Tooltip>
  );

  return (
    <Container className="mt-5">
      <h2>Applicant Dashboard</h2>
      <p>Welcome, {user?.name || "Applicant"}!</p>
      <Button variant="danger" onClick={handleLogout} className="mb-3">
        Logout
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      <h3>Available and Applied Jobs</h3>
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
          {currentJobs.map((job) => {
            const hasApplied = !!job.application;
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
                        {new Date(
                          job.application.created_at
                        ).toLocaleDateString()}
                      </p>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            handleUpdateResume(
                              job.application.id,
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
                      <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip(job.id)}
                        trigger={
                          !messages[job.id] || !resumes[job.id]
                            ? ["hover", "focus"]
                            : []
                        }
                      >
                        <span>
                          <Button
                            variant="primary"
                            onClick={() => handleApply(job.id)}
                            disabled={!messages[job.id] || !resumes[job.id]}
                          >
                            Apply
                          </Button>
                        </span>
                      </OverlayTrigger>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
}

export default ApplicantDashboard;
