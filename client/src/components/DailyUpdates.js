/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaSearch,
  FaTasks,
  FaCheck,
} from "react-icons/fa";
import { CiMail } from "react-icons/ci";

import "./EmployeeHome.css";
import CustomAlert from "./CustomAlert";
import { FaShareAlt } from "react-icons/fa";

const DailyUpdates = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/gettasks`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      
      setSubmittedData(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAlertMessage("Error fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  

  // Convert date string to required format for filtering
  const formatDateForFilter = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const filteredData = filterDate
    ? submittedData.filter(
        (item) =>
          formatDateForFilter(item.createdat) ===
          formatDateForFilter(filterDate)
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
    <Container fluid className="py-4">
      {alertMessage && (
        <CustomAlert message={alertMessage} onClose={closeAlert} />
      )}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h1
            className="text-center mb-4 fw-bolder"
            style={{ color: "#E10174" }}
          >
            <FaTasks className="me-2" /> Daily Task Data ...
          </h1>

          {/* Input and Send Button */}
        

          {/* Date Filter */}
          <Card className="bg-light mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                  <h5 className="mb-0">
                    <FaSearch className="me-2" /> Filter Tasks According to Date
                  </h5>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="d-flex align-items-center mb-0">
                    <FaCalendarAlt className="me-2 text-primary" />
                    <Form.Control
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="shadow-sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Display Submitted Data */}
          <Card className="shadow-sm task-display-card">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FaCheck className="me-2" /> Task History
              </h4>
            </Card.Header>
            <Card.Body>
              {Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(([date, items]) => (
                  <div key={date} className="mb-4">
                    <h5>
                      <Badge bg="pink" className="date-badge px-3 py-2">
                        <FaCalendarAlt className="me-2" /> {date}
                      </Badge>
                    </h5>
                    
                    <ul className="list-group mt-2">
                      {items.map((item) => (
                        <>
                       <Badge bg="success" className="date-badge  opacity-75 py-2 w-25">
                        <CiMail className="me-2 fs-3" />Email: {item.email}
                      </Badge>
                        <li
                          key={item.id}
                          className="list-group-item task-item d-flex justify-content-between align-items-center"
                        >
                       
                          <div className="task-text">{item.taskdata}</div>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleShare(item.taskdata)}
                          >
                            <FaShareAlt /> Share
                          </Button>
                        </li>
                        </>
                        
                        
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="mb-0 text-muted">
                    No tasks found for the selected criteria.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DailyUpdates;
