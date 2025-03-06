import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner, Alert, Badge, Dropdown } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import CustomAlert from "./CustomAlert";
import { FaFilter, FaListUl } from 'react-icons/fa';
import { FcApproval } from "react-icons/fc";


function ViewTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const token = localStorage.getItem("token");
  let userid;
  let role = "";

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userid = decodedToken.id;
      role = decodedToken.role;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/viewticket`);
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        if (userid && role !== "admin") {
          const userTickets = data.filter((ticket) => ticket.employee_id === userid);
          setTickets(userTickets);
        } else {
          setTickets(data);
        }
        setLoading(false);
      } catch (err) {
        setAlertMessage(err.message);
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets. Please try again later.");
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/updatestatus/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticket_id === ticketId ? { ...ticket, status } : ticket
        )
      );
      setAlertMessage(`Updated ticket status to ${status}`);
    } catch (err) {
      console.error("Error updating ticket:", err);
      setAlertMessage(err.message);
      alert("Failed to update ticket status. Please try again.");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "primary";
      case "pending":
        return "warning";
      case "Completed":
        return "success";
      case "reopen":
        return "danger";
      default:
        return "secondary";
    }
  };
   if(priorityFilter==='All'||statusFilter==='All'){
    setPriorityFilter('');
    setStatusFilter('');
   }

  const closeAlert = () => setAlertMessage("");

  // Filter tickets based on priority and status
  const filteredTickets = tickets.filter((ticket) => {
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    return matchesPriority && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      <Row className="align-items-center mb-4 border p-2 rounded">
        <Col md={1}>
          <Dropdown>
            <Dropdown.Toggle className="border bg-transparent text-danger fw-bolder">
              <FaFilter /> Select Priority
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {['All','High', 'Low', 'Medium', 'Urgent'].map((item, index) => (
                <Dropdown.Item key={index} onClick={() => setPriorityFilter(item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={9} className="text-center">
          <h1 className="mb-4 fw-bold" style={{ color: '#E10174' }}>
            <FaListUl /> Support Tickets
          </h1>
        </Col>
        <Col md={1}>
          <Dropdown>
            <Dropdown.Toggle className="border bg-transparent text-danger fw-bolder">
              <FaFilter /> Select Status
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {['All','Open', 'Pending', 'settle', 'Completed','Reopen'].map((item, index) => (
                <Dropdown.Item key={index} onClick={() => setStatusFilter(item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {filteredTickets.length === 0 ? (
        <div className="text-center p-5">
          <Alert variant="info">No tickets found.</Alert>
        </div>
      ) : (
        <Row className="g-1">
          {filteredTickets.map((ticket) => (
            <Col key={ticket.ticket_id} xs={12}>
              <Card className={`h-100 ${ticket.Completed ? "bg-light shadow-lg" : "shadow-lg fw-medium"}`}>
                <Card.Body disabled={ticket.status === 'Settle'}>
                  <Row >
                    <Col md={4}>
                      <Card.Title className="fw-bold">Name: {ticket.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Email: {ticket.email}</Card.Subtitle>
                    </Col>
                    <Col md={4}>
                      <Card.Text><strong>Title:</strong> {ticket.title}</Card.Text>
                      <Card.Text><strong>Description:</strong> {ticket.description}</Card.Text>
                    </Col>
                    <Col md={2}>
                      <Card.Text>
                        <strong>Priority:</strong>{" "}
                        <Badge bg={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      </Card.Text>
                      <Card.Text>
                        <strong>Status:</strong>{" "}
                        <Badge bg={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </Card.Text>
                    </Col>
                    <Col md={2} className="mt-2">
                      <div className="d-grid gap-2 fw-bolder">
                        {role === "admin" && (
                          <>
                            {ticket.status === "Open" && (
                              <>
                                <Button variant="warning" onClick={() => handleStatusUpdate(ticket.ticket_id, "Pending")}>
                                  Mark as Pending
                                </Button>
                                <Button variant="success" onClick={() => handleStatusUpdate(ticket.ticket_id, "Completed")}>
                                  Mark as Completed
                                </Button>
                              </>
                            )}
                            {ticket.status === "Pending" && (
                              <Button variant="success" onClick={() => handleStatusUpdate(ticket.ticket_id, "Completed")}>
                                Mark as Completed
                              </Button>
                            )}
                            {ticket.status === "Completed" && (
                              <>
                                <Button variant="danger" onClick={() => handleStatusUpdate(ticket.ticket_id, "Reopen")}>
                                  Reopen Ticket
                                </Button>
                                <Button variant="secondary" onClick={() => handleStatusUpdate(ticket.ticket_id, "settle")}>
                                  Settle Ticket
                                </Button>
                              </>
                            )}
                            {ticket.status === "Reopen" && (
                              <>
                                <Button variant="warning" onClick={() => handleStatusUpdate(ticket.ticket_id, "Pending")}>
                                  Mark as Pending
                                </Button>
                                <Button variant="success" onClick={() => handleStatusUpdate(ticket.ticket_id, "Completed")}>
                                  Mark as Completed
                                </Button>
                              </>
                            )}
                            {
                              ticket.status === "settle" && (
                                <FcApproval className="fs-1 ms-5"/>
                              )

                            }
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ViewTicket;