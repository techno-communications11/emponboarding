import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./components/Auth/Login.js";
import { Register } from "./components/Auth/Register";
import Navbar from "./components/universal/CustomNavbar.js";
import Updatepassword from "./components/Auth/Updatepassword.js";
import PrivateRoute from "./components/universal/PrivateRoute.js";
import Contract from "./components/onBoarding/Contract.js";
import NtidCreation from "./components/onBoarding/NtidCreation.js";
import NtidSetup from "./components/onBoarding/NtidSetup.js";
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
import { useMyContext } from "./components/universal/MyContext";

const AppContent = () => {
  const location = useLocation();
  const { authState } = useMyContext();

  if (authState.loading) {
    return ( <div className="d-flex justify-content-center align-items-center vh-100 w-100">
      <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
    </div>);
  }

  // Define default redirect routes based on role
  const getDefaultRoute = (role) => {
    switch (role) {
      case "Employee":
        return "/announcements";
      case "Admin":
        return "/admindashboard";
      case "Training Team":
        return "/userdashboard";
      case "Ntid Setup team":
        return "/userdashboard";
      case "Ntid Creation Team":
        return "/userdashboard";
      case "Contract":
        return "/userdashboard";
      default:
        return "/";
    }
  };

  return (
    <>
      {authState.isAuthenticated && location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            authState.isAuthenticated ? (
              <Navigate to={getDefaultRoute(authState.role)} />
            ) : (
              <Login />
            )
          }
        />
        {authState.isAuthenticated && authState.role === "Employee" && (
          <>
            <Route path="/employeehome" element={<PrivateRoute element={<EmployeeHome />} />} />
            <Route path="/viewtasks" element={<PrivateRoute element={<ShowTask />} />} />
            <Route path="/viewTicket" element={<PrivateRoute element={<ViewTicket />} />} />
            <Route path="/announcements" element={<PrivateRoute element={<Announcements />} />} />
          </>
        )}
        {authState.isAuthenticated && authState.role === "Admin" && (
          <>
            <Route
              path="/announcements"
              element={<PrivateRoute element={<CreateAnnouncement />} />}
            />
            <Route path="/assigntask" element={<PrivateRoute element={<Assigntask />} />} />
            <Route path="/viewTicket" element={<PrivateRoute element={<ViewTicket />} />} />
            <Route path="/shedule" element={<PrivateRoute element={<Shedule />} />} />
            <Route path="/dailyupdates" element={<PrivateRoute element={<DailyUpdates />} />} />
            <Route
              path="/admindashboard"
              element={<PrivateRoute element={<AdminDashboard />} />}
            />
            <Route path="/register" element={<PrivateRoute element={<Register />} />} />
            <Route
              path="/resetpassword"
              element={<PrivateRoute element={<Updatepassword />} />}
            />
          </>
        )}
        {authState.isAuthenticated && authState.role === "Training Team" && (
          <>
            <Route
              path="/userdashboard"
              element={<PrivateRoute element={<UserDashboard />} />}
            />
            <Route path="/training" element={<PrivateRoute element={<TrainingData />} />} />
          </>
        )}
        {authState.isAuthenticated && authState.role === "Ntid Setup team" && (
  <>
    <Route
      path="/userdashboard"
      element={<PrivateRoute element={<UserDashboard />} />}
    />
    <Route path="/ntidsetup" element={<PrivateRoute element={<NtidSetup />} />} />
  </>
)}
        {authState.isAuthenticated && authState.role === "Ntid Creation Team" && (
          <>
            <Route
              path="/userdashboard"
              element={<PrivateRoute element={<UserDashboard />} />}
            />
            <Route path="/ntidcreation" element={<PrivateRoute element={<NtidCreation />} />} />
          </>
        )}
        {authState.isAuthenticated && authState.role === "Contract" && (
          <>
            <Route
              path="/userdashboard"
              element={<PrivateRoute element={<UserDashboard />} />}
            />
            <Route path="/contract" element={<PrivateRoute element={<Contract />} />} />
          </>
        )}
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