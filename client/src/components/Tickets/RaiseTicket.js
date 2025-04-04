import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { FaTicketAlt, FaUser, FaAlignLeft, FaExclamationCircle } from "react-icons/fa";
import CustomAlert from "../universal/CustomAlert";
import "./Styles/RaiseTicket.css";
import { useMyContext } from "../universal/MyContext";

function RaiseTicket({ onTicketSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    priority: "Medium",
  });
  const [alertMessage, setAlertMessage] = useState({ message: "", type: "" });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { authState } = useMyContext();

  useEffect(() => {
    if (authState?.userId) {
      setUserId(authState.userId);
      setLoading(false);
    } else {
      setAlertMessage({ 
        message: "User not authenticated. Please log in.", 
        type: "error" 
      });
      setLoading(false);
    }
  }, [authState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    if (!userId) {
      setAlertMessage({ 
        message: "User not authenticated. Please log in.", 
        type: "error" 
      });
      setSubmitting(false);
      return;
    }

    try {
      const ticketData = {
        employee_id: userId,
        name: formData.name.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
      };

      // Validate inputs
      if (!ticketData.name || !ticketData.title || !ticketData.description) {
        throw new Error("All fields are required");
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/createticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create ticket");
      }

      setAlertMessage({ 
        message: "Ticket raised successfully!", 
        type: "success" 
      });
      
      setFormData({
        name: "",
        title: "",
        description: "",
        priority: "Medium",
      });
      
      if (onTicketSubmit) {
        setTimeout(onTicketSubmit, 2000);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setAlertMessage({ 
        message: error.message || "Failed to raise ticket. Please try again.", 
        type: "error" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
      </div>
    );
  }

  return (
    <Container className="jira-ticket-container">
      {alertMessage.message && (
        <CustomAlert 
          message={alertMessage.message} 
          type={alertMessage.type} 
          onClose={() => setAlertMessage({ message: "", type: "" })} 
        />
      )}
      
      <Form onSubmit={handleSubmit} className="jira-ticket-form">
        <h2 className="jira-form-title">
          <FaTicketAlt className="me-2" /> Raise a Ticket
        </h2>

        <Form.Group className="jira-form-group mb-3">
          <Form.Label className="jira-label">
            <FaUser className="me-2" /> User Name
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="jira-input"
            disabled={submitting}
          />
        </Form.Group>

        <Form.Group className="jira-form-group mb-3">
          <Form.Label className="jira-label">
            <FaTicketAlt className="me-2" /> Ticket Title
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter ticket title"
            required
            className="jira-input"
            disabled={submitting}
          />
        </Form.Group>

        <Form.Group className="jira-form-group mb-3">
          <Form.Label className="jira-label">
            <FaAlignLeft className="me-2" /> Description
          </Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue or request"
            rows={5}
            required
            className="jira-textarea"
            disabled={submitting}
          />
        </Form.Group>

        <Form.Group className="jira-form-group mb-4">
          <Form.Label className="jira-label">
            <FaExclamationCircle className="me-2" /> Priority
          </Form.Label>
          <Form.Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="jira-select"
            disabled={submitting}
          >
            {["Low", "Medium", "High", "Urgent"].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
            
          </Form.Select>
        </Form.Group>

        <Button 
          type="submit" 
          className="jira-submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner as="span" size="sm" animation="border" role="status" />
              <span className="ms-2">Submitting...</span>
            </>
          ) : (
            "Submit Ticket"
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default RaiseTicket;