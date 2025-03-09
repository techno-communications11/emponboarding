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
import './TaskForm.css'; // Custom CSS for Jira-like styling

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

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetUsers();
      setAvailableUsers(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUsers(prev => 
      prev.find(u => u.name === user.name) 
        ? prev.filter(u => u.name !== user.name) 
        : [...prev, user]
    );
  };

  const removeSelectedUser = (name) => {
    setSelectedUsers(prev => prev.filter(user => user.name !== name));
  };

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const task = {
      taskDescription,
      userIds: selectedUsers.map(user => user.id),
      priority,
      dueDate,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/createtask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to assign task");

      setAlertMessage("Task assigned successfully!");
      setTaskDescription("");
      setSelectedUsers([]);
      setPriority("");
      setDueDate("");
      setTimeout(() => setClicked(false), 2000);
    } catch (error) {
      setAlertMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="jira-task-form-container">
      {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />}
      <form onSubmit={handleSubmit} className="jira-task-form">
        <h2 className="jira-form-title">
          <FaClipboardList className="me-2" /> Assign a Task
        </h2>

        {/* Task Description */}
        <div className="jira-form-group">
          <label className="jira-label">
            <FaClipboardList className="me-2" /> Task Description
          </label>
          <textarea
            className="jira-textarea"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Enter task details here..."
            rows="4"
            required
          />
        </div>

        {/* Assign To */}
        <div className="jira-form-group">
          <label className="jira-label">
            <FaUserFriends className="me-2" /> Assign To
          </label>
          {selectedUsers.length > 0 && (
            <div className="jira-selected-users">
              {selectedUsers.map((user, index) => (
                <span key={index} className="jira-user-badge">
                  {user.name}
                  <FaTimes 
                    onClick={() => removeSelectedUser(user.name)}
                    className="jira-remove-icon"
                  />
                </span>
              ))}
            </div>
          )}
          <div className="jira-dropdown-wrapper" ref={dropdownRef}>
            <div 
              className="jira-dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaSearch className="me-2" />
              <input
                type="text"
                className="jira-search-input"
                placeholder="Search users by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <FaChevronDown className={`jira-chevron ${dropdownOpen ? 'rotate' : ''}`} />
            </div>
            {dropdownOpen && (
              <div className="jira-dropdown-menu">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <div 
                      key={index}
                      className={`jira-dropdown-item ${selectedUsers.find(u => u.name === user.name) ? 'selected' : ''}`}
                      onClick={() => handleUserSelect(user)}
                    >
                      {user.name}
                      {selectedUsers.find(u => u.name === user.name) && <FaCheck />}
                    </div>
                  ))
                ) : (
                  <div className="jira-no-results">No users found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Priority and Due Date */}
        <div className="jira-form-row">
          <div className="jira-form-group">
            <label className="jira-label">
              <FaFlag className="me-2" /> Priority
            </label>
            <select
              className="jira-select"
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
          <div className="jira-form-group">
            <label className="jira-label">
              <FaCalendarAlt className="me-2" /> Due Date
            </label>
            <input
              type="date"
              className="jira-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="jira-form-actions">
          <button 
            type="button" 
            className="jira-cancel-btn"
            onClick={() => setClicked(false)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="jira-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Assigning...
              </>
            ) : (
              "Assign Task"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}