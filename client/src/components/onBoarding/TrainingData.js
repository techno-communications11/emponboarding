import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserCircle,
  Phone,
  MapPin,
  Calendar,
  Building,
  Mail,
  GraduationCap,
  CheckCircle,
  Clock,
} from "lucide-react";
import CustomAlert from "../universal/CustomAlert";

const TrainingData = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from /users/me
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/me`, {
          method: "GET",
          credentials: "include", // Send HTTP-only cookie
        });
        if (!response.ok) {
          throw new Error("Failed to authenticate. Please log in.");
        }
        const data = await response.json();
        if (data.role !== "Training Team") {
          setAlertMessage("Only Training Team members can access this page.");
          navigate("/"); // Redirect unauthorized roles
        } else {
          setUserId(data.id);
          setRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAlertMessage(error.message);
        navigate("/"); // Redirect to login
      }
    };
    fetchUserData();
  }, [navigate]);

  // Fetch training data once user is authenticated
  useEffect(() => {
    if (!userId || !role) return; // Wait for user data
    fetchData();
  }, [userId, role]);

  const fetchData = async () => {
    setIsLoading(true);
    setAlertMessage("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/gettrainingdata`, {
        method: "GET",
        credentials: "include", // Send HTTP-only cookie
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTrainingData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching training data:", error);
      setAlertMessage(`Failed to load training data: ${error.message}`);
      setTrainingData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, phone) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [phone]: {
        ...updateData[phone],
        [name]: value,
      },
    });
  };

  const handleUpdate = async (phone) => {
    if (!userId) {
      setAlertMessage("User not authenticated. Please log in.");
      return;
    }

    const rowData = updateData[phone] || {};
    if (!rowData.TrainingStatus || !rowData.TrainingCompletedDate ||!rowData.techno_safety_control) {
      setAlertMessage("Training Status and Training Completed Date are required.");
      return;
    }

    try {
      // Check if the data has changed
      const existingRow = trainingData.find((row) => row.phone === phone);
      if (
        existingRow.training_status === rowData.TrainingStatus &&
        existingRow.training_completed_date === rowData.TrainingCompletedDate&& existingRow.techno_safety_control
      ) {
        setAlertMessage("No changes detected.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/insert-training-data`,
        {
          phone,
          id: userId,
          ...rowData,
        },
        {
          withCredentials: true, // Send HTTP-only cookie with axios
        }
      );

      // Update the training data state
      setTrainingData((prevData) =>
        prevData.map((row) =>
          row.phone === phone
            ? {
                ...row,
                training_status: rowData.TrainingStatus,
                training_completed_date: rowData.TrainingCompletedDate,
                techno_safety_control:rowData.techno_safety_control,
              }
            : row
        )
      );

      // Clear the update data for this row
      setUpdateData((prev) => ({ ...prev, [phone]: {} }));

      setAlertMessage(response.data.message || "Training data updated successfully!");
    } catch (error) {
      console.error("Error updating training data:", error);
      setAlertMessage(
        `Failed to update data: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const closeAlert = () => setAlertMessage("");

  if (isLoading && !userId) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="me-2 animate-spin" size={24} />
        <span>Authenticating...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-1">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      <div className="card shadow">
        <div
          className="card-header text-dark"
          style={{
            backgroundImage: "url('/training.jpg')",
            height: "8rem",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <h3 className="text-center mt-5 text-white">
            <GraduationCap className="me-2" size={24} />
            Training Data Management
          </h3>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-4">
              <CheckCircle className="me-2 animate-spin" size={24} />
              <span>Loading data...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="custom-header">
                  <tr className="text-nowrap text-center">
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <UserCircle className="me-1" size={18} /> First Name
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <UserCircle className="me-1" size={18} /> Last Name
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <Phone className="me-1" size={18} /> Phone
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <MapPin className="me-1" size={18} /> Market
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <Calendar className="me-1" size={18} /> Date of Joining
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <Building className="me-1" size={18} /> Main Store
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <UserCircle className="me-1" size={18} /> NTID
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <Mail className="me-1" size={18} /> T Mobile Email
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <Clock className="me-1" size={18} /> NTID Setup Date
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <GraduationCap className="me-1" size={18} /> Training Status
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      <Calendar className="me-1" size={18} /> Training Completed
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>
                      Techno safety control
                    </th>
                    <th style={{ backgroundColor: "#E10174", color: "white" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingData.length > 0 ? (
                    trainingData.map((data, index) => (
                      <tr key={index}>
                        <td className="text-nowrap">{data.first_name || "-"}</td>
                        <td className="text-nowrap">{data.last_name || "-"}</td>
                        <td className="text-nowrap">{data.phone || "-"}</td>
                        <td className="text-nowrap">{data.market || "-"}</td>
                        <td className="text-nowrap">{data.date_of_joining || "-"}</td>
                        <td className="text-nowrap">{data.mainstore || "-"}</td>
                        <td className="text-nowrap">{data.ntid || "-"}</td>
                        <td className="text-nowrap">{data.t_mobile_email || "-"}</td>
                        <td className="text-nowrap">{data.ntid_setup_date || "-"}</td>
                        <td className="text-nowrap">
                          {data.training_status ? (
                            <span className="badge bg-info text-dark">{data.training_status}</span>
                          ) : (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              name="TrainingStatus"
                              value={updateData[data.phone]?.TrainingStatus || ""}
                              onChange={(e) => handleInputChange(e, data.phone)}
                              placeholder="Enter Status"
                            />
                          )}
                        </td>
                        <td className="text-nowrap">
                          {data.training_completed_date ? (
                            <span className="badge bg-info text-dark">
                              {data.training_completed_date}
                            </span>
                          ) : (
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              name="TrainingCompletedDate"
                              value={updateData[data.phone]?.TrainingCompletedDate || ""}
                              onChange={(e) => handleInputChange(e, data.phone)}
                            />
                          )}
                        </td>
                        <td className="text-nowrap">
                          {data.techno_safety_control!==null ? (
                            <span className="badge bg-info text-dark">
                              {data.techno_safety_control===0?"No":"yes"}
                            </span>
                          ) : (
                            <select
                              className="form-select form-select-sm"
                              name="techno_safety_control"
                              value={updateData[data.phone]?.techno_safety_control || ""}
                              onChange={(e) => handleInputChange(e, data.phone)}
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {!data.training_completed_date ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleUpdate(data.phone)}
                            >
                              <CheckCircle className="me-1" size={16} />
                              Update
                            </button>
                          ) : (
                            <span className="badge bg-success">
                              <CheckCircle className="me-1" size={14} />
                              Updated
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingData;