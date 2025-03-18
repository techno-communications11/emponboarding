import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  ListGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaUser, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const WeeklySchedule = () => {
  const [days, setDays] = useState([]);
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userid, setUserid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from /users/me
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/me`, {
          method: "GET",
          credentials: "include", // Send HTTP-only cookie
        });
        if (response.ok) {
          const data = await response.json();
          setUserid(data.id);
          setIsAdmin(data.role === "Admin");
        } else {
          setError("Failed to authenticate. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch schedule data once userid is available
  useEffect(() => {
    if (!userid || loading) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/getweekshedule/${userid}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Send HTTP-only cookie
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            if (!isAdmin) setName(data[0].username);
            setDays(data);
          }
        } else {
          setError("Failed to fetch schedule: " + response.statusText);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setError("Error fetching schedule: " + error.message);
      }
    };

    fetchData();
  }, [userid, isAdmin, loading]);

  const groupedByEmployee = isAdmin
    ? days.reduce((acc, day) => {
        const empId = day.employee_id;
        if (!acc[empId]) {
          acc[empId] = {
            name: day.username,
            schedule: [],
          };
        }
        acc[empId].schedule.push(day);
        return acc;
      }, {})
    : null;

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">{error}</div>;
  }

  return (
    <div className="container-fluid p-4" style={{ minHeight: "auto" }}>
      <style>
        {`
          .sidebar {
            border-right: 1px solid #e2e8f0;
            height: auto;
            position: sticky;
            top: 16px;
          }
          .employee-list-item {
            cursor: pointer;
            padding: 12px 16px;
            transition: all 0.2s ease;
          }
          .employee-list-item:hover {
            background-color: #f1f5f9;
          }
          .employee-list-item.active {
            background-color: #bfdbfe;
            border-left: 3px solid #2563eb;
          }
          .search-input {
            background-color: #f8f9fa;
            border: 1px solid #e2e8f0;
            padding-left: 36px;
          }
          .search-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
          }
          .schedule-header {
            color: #1e293b;
            font-size: 1.25rem;
            font-weight: 600;
          }
          .day-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin: 8px 0;
            transition: transform 0.2s ease;
          }
          .day-card:hover {
            transform: translateX(5px);
          }
          .status-badge {
            font-size: 0.875rem;
            padding: 4px 8px;
            border-radius: 4px;
          }
          .status-off {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status-on {
            background-color: #d1fae5;
            color: #065f46;
          }
          .add-button {
            background-color: #2563eb;
            border: none;
            transition: transform 0.2s ease;
          }
          .add-button:hover {
            transform: rotate(-5deg) scale(1.05);
          }
          @media (max-width: 768px) {
            .sidebar {
              border-right: none;
              border-bottom: 1px solid #e2e8f0;
              height: auto;
              position: static;
              margin-bottom: 16px;
            }
            .employee-list-item {
              padding: 8px 12px;
            }
            .day-card {
              padding: 12px;
            }
          }
        `}
      </style>

      <Row className="g-4">
        {isAdmin && (
          <Col xs={12} md={3} lg={2} className="sidebar">
            <InputGroup className="mb-4">
              <InputGroup.Text>
                <FaFilter />
              </InputGroup.Text>
              <FormControl
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>

            <ListGroup variant="flush">
              {Object.entries(groupedByEmployee || {})
                .filter(([_, { name }]) =>
                  name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                .map(([empId, { name }]) => (
                  <ListGroup.Item
                    key={empId}
                    className={`employee-list-item ${
                      selectedEmployee === empId ? "active" : ""
                    }`}
                    onClick={() => setSelectedEmployee(empId)}
                  >
                    <FaUser className="me-2" /> {name}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Col>
        )}

        <Col xs={12} md={isAdmin ? 9 : 12} lg={isAdmin ? 10 : 12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="schedule-header">
                <FaCalendarAlt className="me-2" />
                {isAdmin
                  ? selectedEmployee
                    ? groupedByEmployee?.[selectedEmployee]?.name
                    : "All Employees Schedule"
                  : `${name}'s Schedule`}
              </h2>
            </motion.div>
          </div>

          {isAdmin && selectedEmployee && (
            <motion.button
              className="btn btn-sm btn-outline-primary mb-4"
              onClick={() => setSelectedEmployee(null)}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filter
            </motion.button>
          )}

          <Row xs={1} sm={2} md={2} lg={3} className="g-2">
            {(isAdmin
              ? selectedEmployee
                ? groupedByEmployee?.[selectedEmployee]?.schedule || []
                : days
              : days
            ).map((day, index) => (
              <Col key={index}>
                <motion.div
                  className="day-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">{day.work_date}</div>
                    <span
                      className={`status-badge ${
                        day.shift_status === "OFF" ? "status-off" : "status-on"
                      }`}
                    >
                      {day.shift_status}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2" />
                    {day.shift_status === "OFF"
                      ? "Day Off"
                      : `${day.shift_start} - ${day.shift_end}`}
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default WeeklySchedule;