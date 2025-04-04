import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaUserCheck, FaUserSlash, FaSpinner } from "react-icons/fa";
import GetUsers from "./GetUsers";
import { Row, Col } from "react-bootstrap";
import { useMyContext } from "../universal/MyContext";
import "./Styles/UserSideNav.css"; // Custom CSS for Jira-like styling

function UserSideNav() {
  const [availableUsers, setAvailableUsers] = useState([]); // Always an array
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addUser } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await GetUsers();
        // Ensure result is an array; fallback to empty array if not
        setAvailableUsers(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
        setAvailableUsers([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      let updatedSelectedUsers;
      if (prevSelectedUsers.find((u) => u.name === user.name)) {
        updatedSelectedUsers = prevSelectedUsers.filter((u) => u.name !== user.name);
      } else {
        updatedSelectedUsers = [...prevSelectedUsers, user];
      }
      addUser(updatedSelectedUsers);
      return updatedSelectedUsers;
    });
  };

  const handleClearAll = () => {
    setSelectedUsers([]);
    addUser([]);
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="jira-sidenav">
      <div className="jira-sidenav-header">
        <Row className="align-items-center">
          <Col xs={6}>
            <h5 className="jira-sidenav-title">Filter by Users</h5>
          </Col>
          <Col xs={6} className="text-end">
            <span className="jira-total-badge">{filteredUsers.length} Total</span>
          </Col>
        </Row>
      </div>
      <div className="jira-sidenav-body">
        {/* Search Input */}
        <div className="jira-search-wrapper">
          <FaSearch className="jira-search-icon" />
          <input
            type="text"
            className="jira-search-input"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Selected Users Counter */}
        <div className="jira-selected-info">
          <span className="jira-selected-badge">
            <FaUserCheck className="me-1" />
            {selectedUsers.length} Selected
          </span>
          {selectedUsers.length > 0 && (
            <button className="jira-clear-btn" onClick={handleClearAll}>
              <FaUserSlash className="me-1" />
              Clear All
            </button>
          )}
        </div>

        {/* Display Users */}
        {loading ? (
          
              <div className="d-flex justify-content-center align-items-center vh-100 w-100">
                <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
              </div>
           
        ) : error ? (
          <div className="jira-error text-danger text-center">{error}</div>
        ) : filteredUsers.length > 0 ? (
          <div className="jira-user-list">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className={`jira-user-item ${
                  selectedUsers.some((u) => u.name === user.name) ? "selected" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <FaUser className="jira-user-icon" />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="jira-no-users">
            No users found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSideNav;