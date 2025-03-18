import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Store,
  Calendar,
  Grid,
  FileText,
  Key,
  Clock,
  Send,
  Lock,
  Loader,
  CheckCircle,
} from "lucide-react";
import CustomAlert from "../universal/CustomAlert";

const NtidCreation = () => {
  const [mergedRows, setMergedRows] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        if (data.role !== "Ntid Creation Team") {
          setAlertMessage("Only NTID Creation Team members can access this page.");
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

  // Fetch data once user is authenticated
  useEffect(() => {
    if (!userId || !role) return; // Wait for user data
    fetchData();
  }, [userId, role]);

  const fetchData = async () => {
    setIsLoading(true);
    setAlertMessage("");
    try {
      const [contractResponse, ntidResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_BASE_URL}/getntidcontract`, {
          credentials: "include", // Send HTTP-only cookie
        }),
        fetch(`${process.env.REACT_APP_BASE_URL}/getntidcreation`, {
          credentials: "include", // Send HTTP-only cookie
        }),
      ]);

      if (!contractResponse.ok || !ntidResponse.ok) {
        throw new Error(
          `Failed to fetch data: Contracts (${contractResponse.status}), NTID (${ntidResponse.status})`
        );
      }

      const contractData = await contractResponse.json();
      const ntidData = await ntidResponse.json();

      const mergedData = mergeData(
        Array.isArray(contractData) ? contractData : [],
        Array.isArray(ntidData) ? ntidData : []
      );
      setMergedRows(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertMessage(`Failed to load data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeData = (contractData, ntidData) => {
    const contractMap = new Map(contractData.map((row) => [row.phone, row]));
    const ntidMap = new Map(ntidData.map((row) => [row.phone, row]));

    const allPhones = new Set([...contractMap.keys(), ...ntidMap.keys()]);
    return Array.from(allPhones).map((phone) => ({
      ...contractMap.get(phone),
      ...ntidMap.get(phone),
    }));
  };

  const handleInputChange = (e, phone) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [phone]: {
        ...prev[phone],
        [name]: value,
      },
    }));
  };

  const handleUpdate = async (row) => {
    if (!userId) {
      setAlertMessage("User not authenticated. Please log in.");
      return;
    }
    const rowFormData = formData[row.phone] || {};

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/ntidcreation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send HTTP-only cookie
        body: JSON.stringify({ ...rowFormData, phone: row.phone, id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setMergedRows((prevRows) =>
        prevRows.map((r) =>
          r.phone === row.phone
            ? {
                ...r,
                ntid_created_on: rowFormData.ntid_created_on || r.ntid_created_on,
                ntid: rowFormData.ntid || r.ntid,
                t_mobile_email: rowFormData.t_mobile_email || r.t_mobile_email,
                temp_password: rowFormData.temp_password || r.temp_password,
              }
            : r
        )
      );
      setFormData((prev) => ({ ...prev, [row.phone]: null }));
      setAlertMessage(result.message || "NTID updated successfully!");
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error updating data:", error);
      setAlertMessage(`Failed to update data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = async (row) => {
    if (!userId) {
      setAlertMessage("User not authenticated. Please log in.");
      return;
    }
    if (!row.ntid || !row.t_mobile_email || !row.temp_password || !row.ntid_created_on) {
      setAlertMessage(
        "All NTID fields (NTID Created On, NTID, T Mobile Email, Temp Password) must be filled before assigning."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/assign-ntid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send HTTP-only cookie
        body: JSON.stringify({ phone: row.phone, id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 200) {
        setMergedRows((prevRows) =>
          prevRows.map((r) => (r.phone === row.phone ? { ...r, assignedntid: true } : r))
        );
        setAlertMessage(result.message || "NTID assigned successfully!");
        await fetchData(); // Refresh data
      } else {
        throw new Error(result.error || "Failed to assign NTID");
      }
    } catch (error) {
      console.error("Error assigning data:", error);
      setAlertMessage(`Failed to assign data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFullyFilled = (row) =>
    row.ntid && row.t_mobile_email && row.temp_password && row.ntid_created_on;

  const closeAlert = () => setAlertMessage("");

  if (isLoading && !userId) {
    return (
      <div className="text-center py-4">
        <Loader className="me-2 animate-spin" size={24} />
        <span>Authenticating...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      <div className="card shadow">
        <div
          className="card-header text-center bg-primary text-white"
          style={{
            backgroundImage: "url('/ntid.avif')",
            width: "100%",
            height: "8rem",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <h3 className="mb-0 mt-5">
            <Key className="me-2 d-inline" size={24} />
            NTID Creation Management
          </h3>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-4">
              <Loader className="me-2 animate-spin" size={24} />
              <span>Loading data...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle" style={{ width: "100%" }}>
                <thead className="table-light">
                  <tr className="text-nowrap">
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <User className="me-1" size={16} /> First Name
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <User className="me-1" size={16} /> Last Name
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Mail className="me-1" size={16} /> Email
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Phone className="me-1" size={16} /> Phone
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <MapPin className="me-1" size={16} /> Market
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Store className="me-1" size={16} /> Main Store
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Calendar className="me-1" size={16} /> Date of Joining
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Grid className="me-1" size={16} /> Stores Assigned
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <FileText className="me-1" size={16} /> Contract
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Clock className="me-1" size={16} /> NTID Created On
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Key className="me-1" size={16} /> NTID
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Mail className="me-1" size={16} /> T Mobile Email
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Lock className="me-1" size={16} /> Temp Password
                    </th>
                    <th style={{ backgroundColor: "#E01074", color: "white" }}>
                      <Send className="me-1" size={16} /> Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mergedRows.map((row, index) => {
                    const rowFormData = formData[row.phone] || {};
                    const isAssigned = row.assignedntid;
                    const isFilled = isFullyFilled(row);
                    return (
                      <tr key={index}>
                        <td className="text-nowrap">{row.first_name || "-"}</td>
                        <td className="text-nowrap">{row.last_name || "-"}</td>
                        <td className="text-nowrap">{row.email || "-"}</td>
                        <td className="text-nowrap">{row.phone || "-"}</td>
                        <td className="text-nowrap">{row.market || "-"}</td>
                        <td className="text-nowrap">{row.mainstore || "-"}</td>
                        <td className="text-nowrap">{row.date_of_joining || "-"}</td>
                        <td className="text-nowrap">{row.stores_to_be_assigned || "-"}</td>
                        <td className="text-nowrap">{row.contract ? "Yes" : "No"}</td>
                        <td>
                          {isAssigned ? (
                            <span className="text-nowrap">{row.ntid_created_on}</span>
                          ) : (
                            <input
                              type="date"
                              name="ntid_created_on"
                              value={rowFormData.ntid_created_on || row.ntid_created_on || ""}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                              style={{ width: "150px" }}
                            />
                          )}
                        </td>
                        <td>
                          {isAssigned ? (
                            <span className="text-nowrap">{row.ntid}</span>
                          ) : (
                            <input
                              type="text"
                              name="ntid"
                              value={rowFormData.ntid || row.ntid || ""}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                              placeholder="Enter NTID"
                              style={{ width: "150px" }}
                            />
                          )}
                        </td>
                        <td>
                          {isAssigned ? (
                            <span className="text-nowrap">{row.t_mobile_email}</span>
                          ) : (
                            <input
                              type="email"
                              name="t_mobile_email"
                              value={rowFormData.t_mobile_email || row.t_mobile_email || ""}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                              placeholder="Enter email"
                              style={{ width: "150px" }}
                            />
                          )}
                        </td>
                        <td>
                          {isAssigned ? (
                            <span className="text-nowrap">{row.temp_password}</span>
                          ) : (
                            <input
                              type="password"
                              name="temp_password"
                              value={rowFormData.temp_password || row.temp_password || ""}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                              placeholder="Enter password"
                              style={{ width: "150px" }}
                            />
                          )}
                        </td>
                        <td className="text-center">
                          {isAssigned ? (
                            <span className="badge bg-success" style={{ width: "150px" }}>
                              <CheckCircle className="me-1" size={14} />
                              Assigned
                            </span>
                          ) : isFilled ? (
                            <button
                              className="btn btn-success btn-sm"
                              style={{ width: "150px" }}
                              onClick={() => handleAssign(row)}
                              disabled={isSubmitting}
                            >
                              <Send className="me-1" size={14} />
                              {isSubmitting ? "Assigning..." : "Assign"}
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ width: "150px" }}
                              onClick={() => handleUpdate(row)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Updating..." : "Update"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NtidCreation;