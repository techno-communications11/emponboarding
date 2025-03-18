/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  FaPaperPlane,
  FaCalendarAlt,
  FaTasks,
  FaShareAlt,
  FaCog,
  FaPlusCircle,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CustomAlert from "./universal/CustomAlert";
import RaiseTicket from "./Tickets/RaiseTicket";
import WeeklySchedule from "../components/SheduleComponent/WeeklySchedule";
import "./EmployeeHome.css"; // Custom CSS for Jira-like styling

const EmployeeHome = () => {
  const [inputValue, setInputValue] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from /users/me
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/me`, {
          method: "GET",
          credentials: "include", // Send HTTP-only cookie
        });
        if (!response.ok) {
          throw new Error("Failed to authenticate. Please log in.");
        }
        const data = await response.json();
        setUserId(data.id);
        setRole(data.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAlertMessage(error.message);
        navigate("/"); // Redirect to login if not authenticated
      }
    };
    fetchUserData();
  }, [navigate]);

  // Fetch tasks once user data is available
  useEffect(() => {
    if (!userId) return; // Wait for userId

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/gettasks`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Send HTTP-only cookie
        });
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        const filterWithId = data.filter((user) => user.userid === userId);
        setSubmittedData(filterWithId);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setAlertMessage("Error fetching tasks: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (!userId) {
      setAlertMessage("User not authenticated. Please log in.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addtask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send HTTP-only cookie
        body: JSON.stringify({ userid: userId, taskdata: inputValue }),
      });
      if (!response.ok) throw new Error("Failed to add task");
      const result = await response.json();
      if (result.id) {
        setAlertMessage("Task added successfully!");
        setSubmittedData([
          ...submittedData,
          { id: result.id, taskdata: inputValue, createdat: new Date().toISOString() },
        ]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setAlertMessage("Error adding task: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForFilter = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const filteredData = filterDate
    ? submittedData.filter(
        (item) => formatDateForFilter(item.createdat) === formatDateForFilter(filterDate)
      )
    : submittedData;

  const groupByDate = (data) => {
    return data.reduce((grouped, item) => {
      const date = formatDateForFilter(item.createdat);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
      return grouped;
    }, {});
  };

  const groupedData = groupByDate(filteredData);
  const closeAlert = () => setAlertMessage("");

  const handleShare = (taskData) => {
    const encodedMessage = encodeURIComponent(`"${taskData}"`);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleTicket = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleNavigate = () => navigate("/viewticket");
  const handleTask = () => navigate("/viewtasks");

  if (loading && !userId) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="jira-container">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      <Row>
        {/* Sidebar */}
        <Col md={3} className="jira-sidebar">
          <h3 className="sidebar-title">
            <FaCog /> Actions
          </h3>
          <div className="filter-section">
            <Button
              variant="outline-success"
              className="w-100 mb-3 jira-button"
              onClick={handleTicket}
            >
              <FaPlusCircle className="me-2" /> Raise Ticket
            </Button>
            <Button
              variant="outline-primary"
              className="w-100 mb-3 jira-button"
              onClick={handleNavigate}
            >
              <FaEye className="me-2" /> View Tickets
            </Button>
            <Button
              variant="outline-primary"
              className="w-100 mb-3 jira-button"
              onClick={handleTask}
            >
              <FaEye className="me-2" /> View Tasks
            </Button>
            <Form.Group className="d-flex align-items-center mb-3">
              <FaCalendarAlt className="me-2 text-primary" />
              <Form.Control
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="filter-input"
                placeholder="Filter by Date"
              />
            </Form.Group>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} className="jira-main">
          <h1 className="jira-title">
            <FaTasks /> Daily Task Updater
          </h1>

          {/* Task Input */}
          <Card className="mb-4 task-input-card">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your daily task details here..."
                  className="task-input"
                  disabled={!userId} // Disable if not authenticated
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="submit-button"
                  disabled={loading || !userId}
                >
                  <FaPaperPlane /> {loading ? "Sending..." : "Send"}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Weekly Schedule */}
          <Card className="mb-1 weekly-schedule-card">
            <Card.Body>
              <h5 className="mb-1">
                <FaCalendarAlt className="me-2" /> Weekly Schedule
              </h5>
              <WeeklySchedule />
            </Card.Body>
          </Card>

          {/* Task History */}
          {loading ? (
            <div className="text-center p-5">
              <span className="spinner-border" role="status" />
            </div>
          ) : Object.keys(groupedData).length > 0 ? (
            <div className="task-list">
              {Object.entries(groupedData).map(([date, items]) => (
                <div key={date} className="task-group">
                  <Badge bg="primary" className="date-badge mb-3">
                    <FaCalendarAlt className="me-2" /> {date}
                  </Badge>
                  {items.map((item) => (
                    <Card key={item.id} className="task-card">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <Card.Text className="task-text">{item.taskdata}</Card.Text>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="share-button"
                          onClick={() => handleShare(item.taskdata)}
                        >
                          <FaShareAlt /> Share
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center p-4 no-tasks-card">
              <Card.Text>No tasks found for the selected criteria.</Card.Text>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal for RaiseTicket */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <RaiseTicket />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeeHome;