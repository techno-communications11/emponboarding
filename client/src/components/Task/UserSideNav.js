import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaUserCheck, FaUserSlash, FaSpinner } from 'react-icons/fa';
import GetUsers from './GetUsers';
import { Row,Col } from 'react-bootstrap';
import { useMyContext } from '../MyContext';

function UserSideNav() {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setname } = useMyContext();

  // Fetch users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await GetUsers(); // Resolving the Promise
        setAvailableUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      // If user is already selected, remove them
      if (prevSelectedUsers.find((u) => u.name === user.name)) {
        return prevSelectedUsers.filter((u) => u.name !== user.name);
      }
      // Otherwise, add them to the selection
      else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  // Filter users based on search query
  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card shadow-sm">
      <div className="card-header text-white">
        <Row>
            <Col md={6}>
            <h5 className="mb-0" style={{color:"#E10174"}}>Filter By Users</h5>
            </Col>
            <Col md={6}>
            <span className="text-end small" style={{color:"#E10174"}}>Total: {filteredUsers.length} users</span>
            </Col>
        </Row>
        
      </div>
      <div className="card-body">
        {/* Search Input */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Selected Users Counter */}
        <div className="d-flex justify-content-between mb-3">
          <span className="badge bg-success">
            <FaUserCheck className="me-1" />
            {selectedUsers.length} selected
          </span>
          {selectedUsers.length > 0 && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => setSelectedUsers([])}
            >
              <FaUserSlash className="me-1" />
              Clear All
            </button>
          )}
        </div>

        {/* Display Users */}
        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <FaSpinner className="fa-spin" />
            <span className="ms-2">Loading users...</span>
          </div>
        ) : (
          <div className="list-group user-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user,index) => (
                <div 
                  key={index} 
                  className={`list-group-item shadow-lg d-flex flex-row gap-2 list-group-item-action d-flex align-items-center ${
                    selectedUsers.some((u) => u.name === user.name) ? "active" : ""
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  
                  <div className="ms-2">
                    <FaUser className="me-2" />
                    {user.name}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted p-3">
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