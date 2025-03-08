import React, { useEffect, useState } from 'react';
import { 
  FaTasks, 
  FaCalendarAlt, 
  FaClock, 
  FaExclamationTriangle, 
  FaUserTie, 
  FaTrashAlt, 
  FaSpinner, 
  FaExclamationCircle 
} from 'react-icons/fa';

function ShowTask() {
  const [tasks, setTasks] = useState([]); // State to store task data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors
   

  // Fetch task data from the backend
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/taskdata`);
        if (!response.ok) {
          throw new Error("Failed to fetch task data");
        }
        const data = await response.json();
        setTasks(data.data); // Update state with fetched data
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };
    
    fetchTaskData();
  }, []);

  // Handle delete task
  const handleDelete = (taskId) => {
    // Add confirmation dialog
    if (window.confirm("Are you sure you want to delete this task?")) {
      // Here you would typically call an API to delete the task
      // For now, we'll just filter it out from the UI
      setTasks(tasks.filter(task => task.task_id !== taskId));
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  // Format date with options
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Display loading state with spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="text-center">
          <FaSpinner className="fa-spin mb-3" size={50} color="#007bff" />
          <h4>Loading tasks...</h4>
        </div>
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: "600px" }}>
        <div className="d-flex align-items-center">
          <FaExclamationCircle size={24} className="me-3" />
          <div>
            <h4 className="alert-heading">Error Loading Tasks</h4>
            <p className="mb-0">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Display task data as cards - one card per row
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-center mb-4">
        <FaTasks className="me-2" size={24} />
        <h2 className="mb-0">Task Management Dashboard</h2>
      </div>

      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <div key={index} className="card shadow mb-4 border-0 task-card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <FaUserTie className="me-2" />
                <h5 className="mb-0">{task.employee_name}</h5>
              </div>
              <span className={`badge bg-${getPriorityBadgeColor(task.priority)} d-flex align-items-center`}>
                <FaExclamationTriangle className="me-1" />
                {task.priority} Priority
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-10">
                  <div className="mb-3">
                    <h5 className="text-dark fw-bolder">Task</h5>
                    <p className="card-text">{task.description}</p>
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center text-muted">
                        <FaCalendarAlt className="me-2" />
                        <div>
                          <small>Due Date</small>
                          <p className="mb-0 text-dark fw-bold">{formatDate(task.due_date)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center text-muted">
                        <FaClock className="me-2" />
                        <div>
                          <small>Created At</small>
                          <p className="mb-0 text-dark fw-bold">{formatDate(task.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                  <button 
                    className="btn btn-danger btn-lg rounded-circle" 
                    onClick={() => handleDelete(task.task_id)}
                    title="Delete Task"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-5 bg-light rounded">
          <FaTasks size={50} className="text-muted mb-3" />
          <h4 className="text-muted">No tasks found</h4>
          <p className="text-muted">Create a new task to get started</p>
        </div>
      )}
    </div>
  );
}

export default ShowTask;