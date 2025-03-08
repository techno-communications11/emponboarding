import React, { useState, useRef, useEffect } from 'react';
import { 
  FaUserFriends, 
  FaCalendarAlt, 
  FaFlag, 
  FaClipboardList,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaCheck
} from 'react-icons/fa';
import GetUsers from './GetUsers';
import CustomAlert from '../CustomAlert';

export default function TaskForm({ setClicked }) {
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

  const dropdownRef = useRef(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchData = async () => {
      const result = await GetUsers(); // Resolving the Promise
      console.log(result); // Now you have actual data
      setAvailableUsers(result);
    };
    fetchData();
  }, []);

  // Close alert after 3 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(""); // Clear the alert message
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [showAlert]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUsers(prev => {
      if (prev.find(u => u.name === user.name)) {
        return prev.filter(u => u.name !== user.name);
      } else {
        return [...prev, user];
      }
    });
  };

  // Remove a selected user
  const removeSelectedUser = (name) => {
    setSelectedUsers(prev => prev.filter(user => user.name !== name));
  };

  // Filter users based on search query
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const task = {
      taskDescription,
      userIds: selectedUsers.map(user => user.id), // Send user IDs instead of names
      priority,
      dueDate,
    };
    console.log(task);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/createtask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }

      // const data = await response.json();
      setAlertMessage("Task Assigned Successfully"); // Set success message
      setShowAlert(true); // Show the alert

      // Reset form fields after successful submission
      setTaskDescription("");
      setSelectedUsers([]);
      setPriority("");
      setDueDate("");
      setIsSubmitting(false);
      setTimeout(() => {
        setClicked(false);
      }, [3000]);
      
    } catch (error) {
      setAlertMessage(error.message); // Set error message
      setShowAlert(true); // Show the alert
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Show CustomAlert if showAlert is true */}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}

      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0 text-center py-2">
            <FaClipboardList className="me-2" />
            Assign a Task
          </h4>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            {/* Task Description */}
            <div className="form-group">
              <label htmlFor="taskDescription" className="form-label fw-bold">
                <FaClipboardList className="me-2 text-primary" />
                Task Description
              </label>
              <textarea
                id="taskDescription"
                className="form-control border-2"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task details here..."
                rows="4"
                required
              />
            </div>

            {/* Assign To */}
            <div className="form-group">
              <label className="form-label fw-bold">
                <FaUserFriends className="me-2 text-primary" />
                Assign To
              </label>
              {selectedUsers.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedUsers.map((user, index) => (
                    <span key={index} className="badge bg-primary d-flex align-items-center p-2">
                      <span className="me-1">{user.name}</span>
                      <FaTimes 
                        className="ms-1 cursor-pointer" 
                        onClick={() => removeSelectedUser(user.name)}
                        style={{ cursor: 'pointer' }}
                      />
                    </span>
                  ))}
                </div>
              )}
              
              {/* User Search Dropdown */}
              <div className="position-relative" ref={dropdownRef}>
                <div 
                  className="form-control d-flex align-items-center justify-content-between user-selector"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <FaSearch className="text-muted me-2" />
                    <input 
                      type="text" 
                      className="border-0 flex-grow-1 user-search"
                      placeholder="Search users by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <FaChevronDown className={`ms-2 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {dropdownOpen && (
                  <div className="dropdown-menu show position-absolute w-100 shadow-lg p-0 mt-1 border" style={{ zIndex: 1000 }}>
                    {filteredUsers.length > 0 ? (
                      <>
                        <div className="p-2 bg-light border-bottom small">
                          <strong>{filteredUsers.length}</strong> users found
                        </div>
                        <div className="user-list-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          {filteredUsers.map((user, index) => (
                            <div 
                              key={index}
                              className={`dropdown-item d-flex align-items-center justify-content-between p-2 ${
                                selectedUsers.find(u => u.name === user.name) ? 'active bg-primary text-white' : ''
                              }`}
                              onClick={() => handleUserSelect(user)}
                            >
                              <div>{user.name}</div>
                              {selectedUsers.find(u => u.name === user.name) && <FaCheck />}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="p-3 text-center text-muted">
                        No users found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Priority and Due Date */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="priority" className="form-label fw-bold">
                    <FaFlag className="me-2 text-primary" />
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="form-select border-2"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dueDate" className="form-label fw-bold">
                    <FaCalendarAlt className="me-2 text-primary" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    className="form-control border-2"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mt-3">
              <button 
                type="button" 
                className="btn btn-outline-secondary flex-grow-1"
                onClick={() => setClicked(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary flex-grow-1 ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Assigning...
                  </>
                ) : (
                  'Assign Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .user-selector {
          cursor: pointer;
        }
        .user-search {
          outline: none;
          width: 100%;
        }
        .dropdown-item {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        .dropdown-item.active:hover {
          background-color: #0d6efd;
        }
        .rotate-180 {
          transform: rotate(180deg);
          transition: transform 0.2s ease;
        }
        .submitting:after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}