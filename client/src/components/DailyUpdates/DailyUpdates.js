/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { FaCalendarAlt, FaTasks, FaShareAlt, FaCog } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { MdAddTask } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../universal/CustomAlert";
import "./Styles/DailyUpdates.css"; // Custom CSS for Jira-like styling
import { TfiAnnouncement } from "react-icons/tfi";


const DailyUpdates = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/gettasks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setSubmittedData(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAlertMessage("Error fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("token");
  let id, role;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      id = decodedToken.id;
      role = decodedToken.role;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

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

  return (
    <div className="jira-container">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      <Row>
        {/* Sidebar */}
        <Col md={3} className="jira-sidebar">
          <h3 className="sidebar-title"><FaCog /> Filters</h3>
          <div className="filter-section">
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
            {role !== "Employee" && role && (
              <>
              <Button
                variant="outline-primary"
                className="w-100 mt-3 jira-button"
                onClick={() => navigate("/assigntask")}
              >
                <MdAddTask className="me-2" /> Assign Task
              </Button>
              <Button
              variant="outline-primary"
              className="w-100 mt-3 jira-button"
              onClick={() => navigate("/announcements")}
            >
              <TfiAnnouncement className="me-2" /> Announcement
            </Button></>
              
            )}
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} className="jira-main">
          <h1 className="jira-title"><FaTasks /> Daily Tasks</h1>
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
                      <Card.Body className="d-flex justify-content-between gap-2 align-items-center ">
                        <div>
                          <Card.Text className="task-text">{item.taskdata}</Card.Text>
                          <div className="task-meta">
                            <Badge bg="success" className="email-badge">
                              <CiMail className="me-2" /> {item.email}
                            </Badge>
                          </div>
                        </div>
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
    </div>
  );
};

export default DailyUpdates;