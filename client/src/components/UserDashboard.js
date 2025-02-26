import React from "react";
import AdminDashboard from "./AdminDashboard";

function UserDashboard() {
  return (
    <div>
      <div
        className="p-1 border-bottom "
        style={{
          backgroundImage: "url('/onboardning.webp')",
          width: "100%",
          height: "15rem",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
      <AdminDashboard/>
    </div>
  );
}

export default UserDashboard;
