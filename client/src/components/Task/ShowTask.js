import React, { useEffect, useState } from "react";
import {
  FaTasks,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaUserTie,
  FaTrashAlt,
  FaSpinner,
} from "react-icons/fa";
import { useMyContext } from "../universal/MyContext";
import { Form } from "react-bootstrap";
import "./Styles/ShowTask.css"; // Custom CSS for Jira-like styling
import CustomAlert from "../universal/CustomAlert";

function ShowTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { users } = useMyContext();
  const [filterDate, setFilterDate] = useState("");
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [alert, setAlert] = useState("");
  const { authState } = useMyContext();

  // Fetch user data from /users/me
  useEffect(() => {
    setRole(authState.role);
    setUserId(authState.userId);
  }, [authState.userId, authState.role]);
  

  // Fetch tasks once user data is available
  useEffect(() => {
    if (!userId || role === null) return; // Wait for user data to be set

    const fetchTaskData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/taskdata`, {
          method: "GET",
          credentials: "include", // Send HTTP-only cookie
        });
         console.log(response,'taskdata')
        if (!response.ok) {
          throw new Error("Failed to fetch task data: " + response.statusText);
        }
        const data = await response.json();

        let finalTasks = data.data || [];

        // Filter based on role
        if (role === "Employee") {
          finalTasks = finalTasks.filter((task) => task.user_id === userId);
        } else if (users && users.length > 0) {
          // Filter by selected employees from context (for admins)
          const userNames = users.map((user) => user.name);
          finalTasks = finalTasks.filter((task) =>
            userNames.includes(task.username)
          );
        }

        // Apply date filter if filterDate exists
        if (filterDate) {
          finalTasks = finalTasks.filter((task) => {
            const taskCreatedDate = new Date(task.created_at).toISOString().split("T")[0];
            return taskCreatedDate === filterDate;
          });
        }

        // console.log("Filtered tasks:", finalTasks); // Debug log
        setTasks(finalTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [users, filterDate, role, userId]);

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/deletetask`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send HTTP-only cookie
          body: JSON.stringify({ id: taskId }), // Send taskId in the body
        });

        if (!response.ok) {
          throw new Error("Failed to delete task: " + response.statusText);
        }

        setTasks(tasks.filter((task) => task.task_id !== taskId));
        setAlert("Successfully deleted.");
      } catch (error) {
        console.error("Error deleting task:", error);
        setAlert(error.message || "Error deleting task.");
      }
    }
  };

  const handleClose = () => setAlert("");

  const getPriorityBadgeColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#d93025"; // Jira-like red
      case "medium":
        return "#f59e0b"; // Amber
      case "low":
        return "#10b981"; // Green
      default:
        return "#6b778c"; // Gray
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jira-error">
        <FaExclamationTriangle size={30} className="text-danger" />
        <h4>Error Loading Tasks</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="jira-task-container">
      {alert && <CustomAlert message={alert} onClose={handleClose} />}
      <div className="jira-header">
        <h2 className="jira-title">
          <FaTasks className="me-2" /> Task Management
        </h2>
        <Form.Group className="jira-date-filter">
          <FaCalendarAlt className="me-2 text-primary" />
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="jira-filter-input"
          />
        </Form.Group>
      </div>

      {tasks.length > 0 ? (
        <div className="jira-task-list">
          {tasks.map((task) => (
            <div key={task.task_id} className="jira-task-card">
              <div className="jira-task-header">
                <div className="jira-employee">
                  <FaUserTie className="me-2" />
                  <span>{task.username}</span>
                </div>
                <span
                  className="jira-priority-badge"
                  style={{ backgroundColor: getPriorityBadgeColor(task.priority) }}
                >
                  <FaExclamationTriangle className="me-1" />
                  {task.priority}
                </span>
              </div>
              <div className="jira-task-body">
                <div className="jira-task-content">
                  <h5 className="jira-task-title">Task</h5>
                  <p className="jira-task-desc">{task.description}</p>
                  <div className="jira-task-meta">
                    <div className="jira-task-date">
                      <FaCalendarAlt className="me-2" />
                      <span>Due: {formatDate(task.due_date)}</span>
                    </div>
                    <div className="jira-task-date">
                      <FaClock className="me-2" />
                      <span>Created: {formatDate(task.created_at)}</span>
                    </div>
                  </div>
                </div>
                {role === "Admin" && (
                  <button
                    className="btn button"
                    onClick={() => handleDelete(task.task_id)}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="jira-no-tasks">
          <FaTasks size={50} className="text-muted" />
          <h4>No tasks found</h4>
          <p>Create a new task to get started</p>
        </div>
      )}
    </div>
  );
}

export default ShowTask;