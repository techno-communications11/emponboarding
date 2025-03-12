import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import AnnouncementForm from "./AnnouncementForm.js";
// import UserSideNav from "../Task/UserSideNav.js";
import Announcements from "./Announcements";

function CreateAnnouncement() {
  const [clicked, setClicked] = useState(false);

  return (
    <Container fluid className="jira-container">
      <Row>
            <Col xs={12} md={4} lg={4}>
              {clicked ? (
                <AnnouncementForm setClicked={setClicked} />
              ) : (
                <div className="jira-assign-card" onClick={() => setClicked(true)}>
                  <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="jira-icon-circle me-3">
                      <IoMdAdd className="jira-icon" />
                    </div>
                    <span className="jira-assign-text">Create Announcement</span>
                  </div>
                </div>
              )}
        </Col>
        <Col>
        <Row>
            <Col xs={12} md={8} lg={8}>
              <Announcements  />
            </Col>
          </Row>
        </Col>
       

      
      </Row>
    </Container>
  );
}

export default CreateAnnouncement;
