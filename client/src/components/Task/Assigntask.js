import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import TaskForm from "./TaskForm";
import GetUsers from "./GetUsers";
import UserSideNav from "./UserSideNav";
import ShowTask from "./ShowTask";
function Assigntask() {
     const [clicked,setClicked]=useState(false);
     const results=GetUsers().data;
  const handleClick = () => {
 console.log(results)
    setClicked(true);
  };

  return (
    <Container fluid className="p-3">
        <Row>
            <Col md={3}>
            <UserSideNav/>
            </Col>
            <Col md={9}>
            {clicked?<TaskForm setClicked={setClicked}/>:<Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <div 
            className="d-flex align-items-center shadow p-4  my-4 bg-white rounded border-start border-primary border-4"
            onClick={handleClick}
            style={{ 
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "8px"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div className="d-flex align-items-center w-100 justify-content-center">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                  <IoMdAdd className="fs-2 text-primary" />
                </div>
                <span className="fs-4 fw-semibold text-primary">Assign Task</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>}
      <Row>
      <ShowTask/>
      </Row>
            </Col>
        </Row>
      
      
    </Container>
  );
}

export default Assigntask;