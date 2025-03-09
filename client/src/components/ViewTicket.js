import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner, Alert, Badge, Dropdown } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import CustomAlert from "./CustomAlert";
import { FaFilter, FaListUl, FaCog } from 'react-icons/fa';
import { FcApproval } from "react-icons/fc";
import './ViewTicket.css'; // Assuming you'll add custom CSS

function ViewTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState(""); // date filter state

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
        if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
        const data = await response.json();
        setTickets(userid && role !== "Admin" ? data.filter(ticket => ticket.employee_id === userid) : data);
        setLoading(false);
      } catch (err) {
        setAlertMessage(err.message);
        setError("Failed to load tickets. Please try again later.");
        setLoading(false);
      }
    };
    fetchTickets();
  }, [userid, role]);

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/updatestatus/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      setTickets(prev => prev.map(ticket => ticket.ticket_id === ticketId ? { ...ticket, status } : ticket));
      setAlertMessage(`Updated ticket status to ${status}`);
    } catch (err) {
      setAlertMessage(err.message);
    }
  };

  const getPriorityColor = (priority) => ({
    high: "danger",
    medium: "warning",
    low: "success",
    urgent: "dark",
  }[priority.toLowerCase()] || "secondary");

  const getStatusColor = (status) => ({
    open: "primary",
    pending: "warning",
    completed: "success",
    reopen: "danger",
    settle: "info",
  }[status.toLowerCase()] || "secondary");

  const closeAlert = () => setAlertMessage("");

  const filteredTickets = tickets.filter(ticket => {
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesSearch = searchQuery ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) 
    || ticket.name.toLowerCase().includes(searchQuery.toLowerCase()): true;

    // Filter by date if a date is selected
    const matchesDate = filterDate ? ticket.created_at.slice(0, 10) === filterDate : true;

    return matchesPriority && matchesStatus && matchesSearch && matchesDate;
  });

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center p-5"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="jira-container">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      <Row>
        {/* Sidebar */}
        <Col md={3} className="jira-sidebar">
          <h3 className="sidebar-title"><FaCog /> Filters</h3>
          <div className="filter-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search tickets by name, title, and description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="jira-filter-input mt-2 fw-medium"
            />
            <Dropdown className="mt-1">
              <Dropdown.Toggle className="filter-toggle w-100 text-start">
                <FaFilter /> Priority
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {['', 'High', 'Medium', 'Low', 'Urgent'].map((item, idx) => (
                  <Dropdown.Item key={idx} onClick={() => setPriorityFilter(item)}>
                    {item || 'All'}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="mt-1 ">
              <Dropdown.Toggle className="filter-toggle w-100 text-start">
                <FaFilter /> Status
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {['', 'Open', 'Pending', 'Completed', 'Reopen', 'Settle'].map((item, idx) => (
                  <Dropdown.Item key={idx} onClick={() => setStatusFilter(item)}>
                    {item || 'All'}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} className="jira-main">
          <h1 className="jira-title"><FaListUl /> Tickets</h1>
          {filteredTickets.length === 0 ? (
            <Alert variant="info" className="text-center">No tickets found.</Alert>
          ) : (
            <div className="ticket-list">
              {filteredTickets.map(ticket => (
                <Card key={ticket.ticket_id} className="ticket-card">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <Card.Title className="ticket-title">{ticket.name}</Card.Title>
                        <Card.Text className="fw-bolder text-success">{ticket.title}</Card.Text>
                        <Card.Text className="ticket-desc">{ticket.description}</Card.Text>
                        <div className="ticket-meta">
                          <Badge className='me-2' bg={getPriorityColor(ticket.created_at)}>{ticket.created_at.slice(0,10)}</Badge>
                          <Badge bg={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          <Badge bg={getStatusColor(ticket.status)} className="ms-2">{ticket.status}</Badge>
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        {role === "Admin" && ticket.status !== "Settle" && (
                          <div className="ticket-actions">
                            {ticket.status === "Open" && (
                              <>
                                <Button variant="outline-warning" size="sm" onClick={() => handleStatusUpdate(ticket.ticket_id, "Pending")}>Pending</Button>
                                <Button variant="outline-success" size="sm" className="ms-2" onClick={() => handleStatusUpdate(ticket.ticket_id, "Completed")}>Complete</Button>
                              </>
                            )}
                            {ticket.status === "Pending" && (
                              <Button variant="outline-success" size="sm" onClick={() => handleStatusUpdate(ticket.ticket_id, "Completed")}>Complete</Button>
                            )}
                            {ticket.status === "Completed" && (
                              <>
                                <Button variant="outline-danger" size="sm" onClick={() => handleStatusUpdate(ticket.ticket_id, "Reopen")}>Reopen</Button>
                                <Button variant="outline-secondary" size="sm" className="ms-2" onClick={() => handleStatusUpdate(ticket.ticket_id, "Settle")}>Settle</Button>
                              </>
                            )}
                            {ticket.status === "Reopen" && (
                              <>
                                <Button variant="outline-warning" size="sm" onClick={() => handleStatusUpdate(ticket.ticket_id, "Pending")}>Pending</Button>
                                <Button variant="outline-success" size="sm" className="ms-2" onClick={() => handleStatusUpdate(ticket.ticket_id, "Completed")}>Complete</Button>
                              </>
                            )}
                          </div>
                        )}
                        {ticket.status === "Settle" && <FcApproval className="settle-icon" />}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ViewTicket;
