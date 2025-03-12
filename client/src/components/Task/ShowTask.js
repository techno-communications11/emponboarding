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
import { jwtDecode } from "jwt-decode";
import CustomAlert from "../universal/CustomAlert";

function ShowTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { users } = useMyContext();
  const [filterDate, setFilterDate] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const[alert,setAlert]=useState("");

  // Decode token and set role/userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
        setError("Invalid token. Please log in again.");
      }
    }
  }, []);
  const handleClose=()=>setAlert("");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/taskdata`);
        if (!response.ok) throw new Error("Failed to fetch task data");
        const data = await response.json();
        
        let finalTasks = data.data;

        // Filter based on role
        if (role === "Employee") {
          finalTasks = data.data.filter((task) => task.user_id === userId);
        } 
        // Filter by selected employees
        else if (users && users.length > 0) {
          const userNames = users.map((user) => user.name);
          // console.log("Selected user names:", userNames);
          finalTasks = data.data.filter((task) => 
            userNames.includes(task.employee_name)
          );
        }

        // Apply date filter if filterDate exists
        if (filterDate) {
          finalTasks = finalTasks.filter((task) => {
            const taskDueDate = new Date(task.created_at).toISOString().split("T")[0];
            return taskDueDate === filterDate;
          });
        }

        console.log("Filtered tasks:", finalTasks); // Debug log
        setTasks(finalTasks);
      } catch (error) {
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
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: taskId }), // send taskId in the body
        });
   setAlert("successfully deleted..")
        if (response.ok) {
          setTasks(tasks.filter((task) => task.task_id !== taskId));
        } else {
          setAlert("Failed to delete task.");
        }
      } catch (error) {
        setAlert("Error deleting task:", error);
      }
    }
  };
  

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
      <div className="jira-loading">
        <FaSpinner className="fa-spin text-primary" size={40} />
        <p>Loading tasks...</p>
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
                  <span>{task.employee_name}</span>
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
                {role==='Admin'&&<button
                  className="btn button "
                  onClick={() => handleDelete(task.task_id)}
                >
                  <FaTrashAlt /> Delete
                </button>}
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