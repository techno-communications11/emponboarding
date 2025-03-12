import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaUserCheck, FaUserSlash, FaSpinner } from 'react-icons/fa';
import GetUsers from './GetUsers';
import { Row, Col } from 'react-bootstrap';
import { useMyContext } from '../universal/MyContext';
import './Styles/UserSideNav.css'; // Custom CSS for Jira-like styling

function UserSideNav() {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addUser } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await GetUsers();
        setAvailableUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
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
            <button
              className="jira-clear-btn"
              onClick={handleClearAll}
            >
              <FaUserSlash className="me-1" />
              Clear All
            </button>
          )}
        </div>

        {/* Display Users */}
        {loading ? (
          <div className="jira-loading">
            <FaSpinner className="fa-spin me-2" />
            Loading users...
          </div>
        ) : (
          <div className="jira-user-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className={`jira-user-item ${selectedUsers.some((u) => u.name === user.name) ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <FaUser className="jira-user-icon" />
                  <span>{user.name}</span>
                </div>
              ))
            ) : (
              <div className="jira-no-users">
                No users found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSideNav;