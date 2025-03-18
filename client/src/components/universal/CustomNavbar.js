import React from "react";
import { Link } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./Styles/CustomNavbar.css";
import { useMyContext } from "../universal/MyContext";

const CustomNavbar = () => {
  const { authState, logout } = useMyContext();
  // const navigate = useNavigate();

  const handleNavLinkClick = () => {
    const navbar = document.querySelector(".navbar-collapse");
    if (navbar) {
      navbar.classList.remove("show");
    }
  };

  // Show nothing while loading or if not authenticated
  if (authState.loading || !authState.isAuthenticated) {
    return null;
  }

  // Role-based home routes for Navbar.Brand
  const homeRoute =
    {
      Admin: "/admindashboard",
      Employee: "/announcements",
      "Training Team": "/userdashboard",
      "Ntid Setup team": "/userdashboard",
      "Ntid Creation Team": "/userdashboard",
      Contract: "/userdashboard",
    }[authState.role] || "/userdashboard"; // Fallback to /userdashboard if role not matched

  return (
    <Navbar expand="lg" className="jira-navbar shadow-sm">
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to={homeRoute}
          className="d-flex align-items-center"
        >
          <img src="logo.webp" height={30} alt="Logo" className="jira-logo" />
          <span className="jira-brand ms-2">Techno Communications LLC</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" className="jira-toggle" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto d-flex align-items-center">
            {authState.role === "Employee" && (
              <>
                <Nav.Link
                  as={Link}
                  to="/employeehome"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Update Task
                </Nav.Link>
                
              </>
            )}
            {authState.role === "Contract" && (
              <Nav.Link
                as={Link}
                to="/contract"
                className="fw-bolder jira-nav-link"
                onClick={handleNavLinkClick}
              >
                Contract Data
              </Nav.Link>
            )}
            {authState.role === "Training Team" && (
              <Nav.Link
                as={Link}
                to="/training"
                className="fw-bolder jira-nav-link"
                onClick={handleNavLinkClick}
              >
                Training Data
              </Nav.Link>
            )}
            {authState.role === "Ntid Setup team" && (
              <Nav.Link
                as={Link}
                to="/ntidsetup"
                className="fw-bolder jira-nav-link"
                onClick={handleNavLinkClick}
              >
                NTID Setup Data
              </Nav.Link>
            )}
            {authState.role === "Ntid Creation Team" && (
              <Nav.Link
                as={Link}
                to="/ntidcreation"
                className="fw-bolder jira-nav-link"
                onClick={handleNavLinkClick}
              >
                NTID Creation Data
              </Nav.Link>
            )}
            {authState.role === "Admin" && (
              <>
                <Nav.Link
                  as={Link}
                  to="/viewticket"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Tickets
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/shedule"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Schedule
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/dailyupdates"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Daily Task
                </Nav.Link>
                
                
                <Nav.Link
                  as={Link}
                  to="/register"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/resetpassword"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Reset Password
                </Nav.Link>
              </>
            )}
            <Button
              variant="outline-danger"
              className="jira-logout-btn ms-2"
              onClick={logout}
            >
              <RiLogoutBoxRLine className="me-1" /> Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
