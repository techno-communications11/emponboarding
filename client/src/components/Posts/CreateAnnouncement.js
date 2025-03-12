import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import AnnouncementForm from "./AnnouncementForm.js";
// import UserSideNav from "../Task/UserSideNav.js";
import Announcements from "./Announcements";
import "../Task/Assigntask.js"; // Custom CSS for Jira-like styling

function CreateAnnouncement() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <Container fluid className="jira-container">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="jira-sidebar">
          Last Announcement Acknowledgements
        </Col>

        {/* Main Content */}
        <Col md={5} className="jira-main">
          {clicked ? (
            <AnnouncementForm setClicked={setClicked} />
          ) : (
            <Row className="justify-content-center mb-3">
              <Col xs={12} md={10} lg={12}>
                <div
                  className="jira-assign-card"
                  onClick={handleClick}
                >
                  <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="jira-icon-circle me-3">
                      <IoMdAdd className="jira-icon" />
                    </div>
                    <span className="jira-assign-text">Create Announcement</span>
                  </div>
                </div>
              </Col>
            </Row>
          )}
          <Row>
            <Announcements className="jira-show-task" />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateAnnouncement;