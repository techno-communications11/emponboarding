import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { FaTicketAlt, FaUser, FaAlignLeft, FaExclamationCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import CustomAlert from "./CustomAlert";
import "./RaiseTicket.css"; // Custom CSS for Jira-like styling

function RaiseTicket({ onTicketSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    priority: "Medium",
  });
  const [alertMessage, setAlertMessage] = useState("");

  const token = localStorage.getItem("token");
  let id;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      id = decodedToken.id;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setAlertMessage("User not authenticated. Please log in.");
      return;
    }

    try {
      const ticketData = {
        employee_id: id,
        name: formData.name,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
      };

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/createticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      setAlertMessage("Ticket raised successfully!");
      setFormData({
        name: "",
        title: "",
        description: "",
        priority: "Medium",
      });
      if (onTicketSubmit) setTimeout(onTicketSubmit, 2000); // Delay to show alert
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setAlertMessage("Failed to raise ticket. Please try again.");
    }
  };

  return (
    <Container className="jira-ticket-container">
      {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />}
      <form onSubmit={handleSubmit} className="jira-ticket-form">
        <h2 className="jira-form-title">
          <FaTicketAlt className="me-2" /> Raise a Ticket
        </h2>

        {/* User Name */}
        <div className="jira-form-group">
          <label className="jira-label">
            <FaUser className="me-2" /> User Name
          </label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="jira-input"
          />
        </div>

        {/* Ticket Title */}
        <div className="jira-form-group">
          <label className="jira-label">
            <FaTicketAlt className="me-2" /> Ticket Title
          </label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter ticket title"
            required
            className="jira-input"
          />
        </div>

        {/* Ticket Description */}
        <div className="jira-form-group">
          <label className="jira-label">
            <FaAlignLeft className="me-2" /> Description
          </label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue or request"
            rows={5}
            required
            className="jira-textarea"
          />
        </div>

        {/* Priority Selection */}
        <div className="jira-form-group">
          <label className="jira-label">
            <FaExclamationCircle className="me-2" /> Priority
          </label>
          <Form.Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="jira-select"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Form.Select>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="jira-submit-btn">
          Submit Ticket
        </Button>
      </form>
    </Container>
  );
}

export default RaiseTicket;