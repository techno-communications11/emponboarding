import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { FaTicketAlt, FaUser, FaAlignLeft, FaExclamationCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import CustomAlert from "./CustomAlert";

function RaiseTicket({ onTicketSubmit }) {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    priority: "Medium", // Default value
  });
    const [alertMessage, setAlertMessage] = useState("");
  const closeAlert = () => setAlertMessage("");

  // Fetch token and decode employee ID
  const token = localStorage.getItem("token");
  let id;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      id = decodedToken.id;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  } else {
    console.error("Token not found");
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setAlertMessage("User not authenticated. Please log in.");
      return;
    }

    try {
      const ticketData = {
        employee_id: id, // From JWT token
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

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      const result = await response.json();
      console.log("Ticket Submitted:", result);
      setAlertMessage("Ticket raised successfully!");

      // Reset form
      setFormData({
        name: "",
        title: "",
        description: "",
        priority: "Medium",
      });

      // Call onTicketSubmit to close modal if provided
      if (onTicketSubmit) onTicketSubmit();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setAlertMessage("Failed to raise ticket. Please try again.");
    }
  };

  return (
    <Container className="mt-2" style={{ maxWidth: "600px" }}>
         {alertMessage && (
        <CustomAlert message={alertMessage} onClose={closeAlert} />
      )}
      <h1 className="text-center mb-4 fw-bolder" style={{ color: "#E10174" }}>
        <FaTicketAlt className="me-2 fw-bolder" style={{ color: "#E10174" }} /> Raise a Ticket
      </h1>
      <Form onSubmit={handleSubmit}>
        {/* User Name */}
        <Form.Group className="mb-3">
          <Form.Label>
            <FaUser className="me-2" /> User Name
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        {/* Ticket Title */}
        <Form.Group className="mb-3">
          <Form.Label>
            <FaTicketAlt className="me-2" /> Ticket Title
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter ticket title"
            required
          />
        </Form.Group>

        {/* Ticket Description */}
        <Form.Group className="mb-3">
          <Form.Label>
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
          />
        </Form.Group>

        {/* Priority Selection */}
        <Form.Group className="mb-4">
          <Form.Label>
            <FaExclamationCircle className="me-2" /> Priority
          </Form.Label>
          <Form.Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Form.Select>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="w-100">
          Submit Ticket
        </Button>
      </Form>
    </Container>
  );
}

export default RaiseTicket;