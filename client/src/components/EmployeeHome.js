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
  Modal,
} from "react-bootstrap";
import {
  FaPaperPlane,
  FaCalendarAlt,
  FaSearch,
  FaTasks,
  FaCheck,
  FaShareAlt,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "./EmployeeHome.css";
import CustomAlert from "./CustomAlert";
import RaiseTicket from "./RaiseTicket";
import { FaPlusCircle } from "react-icons/fa"; // Import icons
import WeeklySchedule from "./WeeklySchedule";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";





const EmployeeHome = () => {
  const [inputValue, setInputValue] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [show, setShow] = useState(false); // Modal visibility state
const navigate=useNavigate();
  // Fetch token from localStorage
  const token = localStorage.getItem("token");
  let id;
  let role;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      id = decodedToken.id;
       role=decodedToken.role;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  } else {
    console.error("Token not found");
  }
 console.log(id,role);

   const handleNavigate=()=>{
    navigate('/viewticket')

   }
  // Fetch tasks on component mount
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

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      const filterWithId = data.filter((user) => user.userid === id);
      setSubmittedData(filterWithId);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAlertMessage("Error fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addtask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: id,
          taskdata: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const result = await response.json();

      if (result.id) {
        setAlertMessage("Task added successfully!");
        setSubmittedData([
          ...submittedData,
          {
            id: result.id,
            taskdata: inputValue,
            createdat: new Date().toISOString(),
          },
        ]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setAlertMessage("Error adding task.");
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
        (item) =>
          formatDateForFilter(item.createdat) === formatDateForFilter(filterDate)
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

  const handleTicket = () => {
    setShow(true); // Show the modal
  };

  const handleClose = () => {
    setShow(false); // Hide the modal
  };

  return (
    <Container fluid className="py-4">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      <Row className="card p-3 shadow-sm" style={{ height: "100%" }}>
      {/* Left Column: Ticket Buttons */}
      <Col
        md={4}
        style={{ borderRight: "1px solid #e6e6e6" }}
        className="d-flex gap-2 align-items-start"
      >
        <Button
          variant="success"
          className="btn-sm text-white fw-bolder d-flex align-items-center"
          onClick={handleTicket}
        >
          <FaPlusCircle className="me-2" /> Raise Ticket
        </Button>
        <Button
          variant="success"
          className="btn-sm text-white fw-bolder d-flex align-items-center"
          
        onClick={handleNavigate}
        >
          <FaEye className="me-2" /> View Ticket
        </Button>
      </Col>
      
      {/* Right Column: Weekly Schedule */}
      <Col md={12} className="text-end">
        <div className="w-100">
          <h5 className="mb-3 fw-bolder" style={{color:"#E10174"}}>
            <FaCalendarAlt className="me-2" /> Weekly Schedule
          </h5>
          <WeeklySchedule />
        </div>
      </Col>
    </Row>


      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            
            <h1 className="text-center mb-4 fw-bolder" style={{ color: "#E10174" }}>
            <FaTasks className="me-2" /> Daily Task Updater ...
          </h1>
            

          </Row>
         
         
          

          {/* Input and Send Button */}
          <Form onSubmit={handleSubmit} className="mb-4">
            <Row>
              <Col xs={12}>
                <div className="position-relative">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your daily task details here..."
                    className="shadow-lg border-3 border-primary task-input text-center fw-bolder d-flex align-items-center justify-content-center"
                    style={{
                      resize: "none",
                      height: "120px",
                      display: "flex",
                      textAlign: "center",
                      paddingTop: "40px",
                    }}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    className="position-absolute"
                    style={{ bottom: "45px", right: "10px", borderRadius: "50%" }}
                    disabled={loading}
                  >
                    <FaPaperPlane />
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>

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

      {/* Modal for RaiseTicket */}
      <Modal show={show} onHide={handleClose} centered>

        <Modal.Body>
          <RaiseTicket />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeeHome;