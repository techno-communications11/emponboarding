import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./Styles/CustomNavbar.css"; // Custom CSS for Jira-like styling

const CustomNavbar = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      navigate("/"); // Redirect to login page if no token
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNavLinkClick = () => {
    const navbar = document.querySelector(".navbar-collapse");
    if (navbar) {
      navbar.classList.remove("show");
    }
  };

  return (
    <Navbar expand="lg" className="jira-navbar shadow-sm">
      <Container fluid>
        {/* Logo and Brand Name */}
        <Navbar.Brand
          as={Link}
          to={
            role === "Admin"
              ? "/adminDashboard"
              : role === "Employee"
              ? "/announcements"
              : "/userDashboard"
          }
          className="d-flex align-items-center"
        >
          <img src="logo.webp" height={40} alt="Logo" className="jira-logo" />
          <span className="jira-brand ms-2">Techno Communications LLC</span>
        </Navbar.Brand>

        {/* Toggle for mobile view */}
        <Navbar.Toggle aria-controls="navbarNav" className="jira-toggle" />

        {/* Collapsible menu */}
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto d-flex align-items-center">
            {role==="Employee"&&(
            <Nav.Link
            as={Link}
            to="/employeehome"
            className="fw-bolder jira-nav-link fw-bolder "
            onClick={handleNavLinkClick}
          >
            Update Task
          </Nav.Link>
            )}
            {/* Shared Links */}
            {role === "Contract" && (
              <Nav.Link
                as={Link}
                to="/contract"
                className="fw-bolder jira-nav-link fw-bolder "
                onClick={handleNavLinkClick}
              >
                Contract Data
              </Nav.Link>
            )}
            {role === "Training Team" && (
              <Nav.Link
                as={Link}
                to="/training"
                className="jira-nav-link fw-bolder"
                onClick={handleNavLinkClick}
              >
                Training Data
              </Nav.Link>
            )}
            {role === "Ntid Setup team" && (
              <Nav.Link
                as={Link}
                to="/ntidsetup"
                className="jira-nav-link fw-bolder"
                onClick={handleNavLinkClick}
              >
                NTID Setup Data
              </Nav.Link>
            )}
            {role === "Ntid Creation Team" && (
              <Nav.Link
                as={Link}
                to="/ntidcreation"
                className="jira-nav-link fw-bolder"
                onClick={handleNavLinkClick}
              >
                NTID Creation Data
              </Nav.Link>
            )}

            {/* Admin-only Links */}
            {role === "Admin" && (
              <>
                <Nav.Link
                  as={Link}
                  to="/viewticket"
                  className="jira-nav-link fw-bolder fw-bolder"
                  onClick={handleNavLinkClick}
                >
                  Tickets
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/shedule"
                  className="jira-nav-link fw-bolder"
                  onClick={handleNavLinkClick}
                >
                  Schedule
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/dailyupdates"
                  className="jira-nav-link fw-bolder"
                  onClick={handleNavLinkClick}
                >
                  Daily Task
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className="jira-nav-link fw-bolder"
                  onClick={handleNavLinkClick}
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/resetpassword"
                  className="jira-nav-link fw-bolder"
                  onClick={handleNavLinkClick}
                >
                  Reset Password
                </Nav.Link>
              </>
            )}

            {/* Logout Button */}
            <Button
              variant="outline-danger"
              className="jira-logout-btn ms-2"
              onClick={handleLogout}
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