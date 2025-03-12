import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/Auth/Login.js";
import { Register } from "./components/Auth/Register";
import Navbar from "./components/universal/CustomNavbar.js";
import Updatepassword from "./components/Auth/Updatepassword.js";
import PrivateRoute from "./components/universal/PrivateRoute.js";
import { useLocation } from "react-router-dom";
import Contract from "./components/onBoarding/Contract.js";
import NtidCreation from "./components/onBoarding/NtidCreation.js";
import NtidSetup from "./components/onBoarding/NtidSetup.js";
import { jwtDecode } from "jwt-decode";
import TrainingData from "./components/onBoarding/TrainingData.js";
import AdminDashboard from "./components/onBoarding/AdminDashboard.js";
import UserDashboard from "./components/UserDashboard.js";
import Shedule from "./components/SheduleComponent/Shedule.js";
import EmployeeHome from "./components/EmployeeHome.js";
import DailyUpdates from "./components/DailyUpdates/DailyUpdates.js";
import ViewTicket from "./components/Tickets/ViewTicket.js";
import Assigntask from "./components/Task/Assigntask.js";
import ShowTask from "./components/Task/ShowTask.js";
import CreateAnnouncement from "./components/Posts/CreateAnnouncement.js";
import Announcements from "./components/Posts/Announcements.js";

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
              path="/viewtasks"
              element={<PrivateRoute element={<ShowTask />} />}
            />
            <Route
              path="/viewTicket"
              element={<PrivateRoute element={<ViewTicket />} />}
            />
            <Route
              path="/announcements"
              element={<PrivateRoute element={<Announcements />} />}
            />
          </>
        )}

        {/* Role-based private routes */}
        {role === "Admin" && (
          <>
           <Route
              path="/announcements"
              element={<PrivateRoute element={<CreateAnnouncement />} />}
            />
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
