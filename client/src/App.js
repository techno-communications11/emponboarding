import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import Navbar from "./components/CustomNavbar.js";
import Updatepassword from "./components/Updatepassword";
import PrivateRoute from "./components/PrivateRoute.js";
import { useLocation } from "react-router-dom";
import Contract from "./components/Contract.js";
import NtidCreation from "./components/NtidCreation.js";
import NtidSetup from "./components/NtidSetup.js";
import { jwtDecode } from "jwt-decode";
import TrainingData from "./components/TrainingData.js";
import AdminDashboard from "./components/AdminDashboard.js";
import UserDashboard from "./components/UserDashboard.js";
import Shedule from "./components/Shedule.js";
import EmployeeHome from "./components/EmployeeHome.js";
import DailyUpdates from "./components/DailyUpdates.js";
import ViewTicket from "./components/ViewTicket.js";
import Assigntask from "./components/Task/Assigntask.js";

// Function to get role from token
const getRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // Ensure your token contains a "role" field
  } catch (error) {
    return null;
  }
};

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const role = getRoleFromToken();

  return (
    <>
      {isAuthenticated && location.pathname !== "/" && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        {role==="Employee"&&(
          <>
          <Route
              path="/employeehome"
              element={<PrivateRoute element={<EmployeeHome />} />}
            />
            <Route
              path="/viewTicket"
              element={<PrivateRoute element={<ViewTicket />} />}
            />
          </>
        )}

        {/* Role-based private routes */}
        {role === "Admin" && (
          <>
           <Route
              path="/assigntask"
              element={<PrivateRoute element={<Assigntask />} />}
            />
          <Route
              path="/viewTicket"
              element={<PrivateRoute element={<ViewTicket />} />}
            />
            <Route
              path="/shedule"
              element={<PrivateRoute element={<Shedule />} />}
            />
             <Route
              path="/dailyupdates"
              element={<PrivateRoute element={<DailyUpdates />} />}
            />
            
            <Route
              path="/admindashboard"
              element={<PrivateRoute element={<AdminDashboard />} />}
            />
            <Route
              path="/register"
              element={<PrivateRoute element={<Register />} />}
            />
            <Route
              path="/resetpassword"
              element={<PrivateRoute element={<Updatepassword />} />}
            />
          </>
        )}
        {role === "Training Team" && (
          <>
            <Route
              path="/userdashboard"
              element={<PrivateRoute element={<UserDashboard />} />}
            />
            <Route
              path="/training"
              element={<PrivateRoute element={<TrainingData />} />}
            />
          </>
        )}
        {role === "Ntid Setup team" && (
          <>
            <Route
              path="/userdashboard"
              element={<PrivateRoute element={<UserDashboard />} />}
            />
            <Route
              path="/ntidsetup"
              element={<PrivateRoute element={<NtidSetup />} />}
            />{" "}
          </>
        )}
        {role === "Ntid Creation Team" && (
          <>
            <Route
              path="/userdashboard"
              element={<PrivateRoute element={<UserDashboard />} />}
            />
            <Route
              path="/ntidcreation"
              element={<PrivateRoute element={<NtidCreation />} />}
            />{" "}
          </>
        )}
        {role === "Contract" && (
          <>
            <Route
              path="/userdashboard"
              element={<PrivateRoute element={<UserDashboard />} />}
            />
            <Route
              path="/contract"
              element={<PrivateRoute element={<Contract />} />}
            />{" "}
          </>
        )}

        {/* Redirect unauthorized users */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
