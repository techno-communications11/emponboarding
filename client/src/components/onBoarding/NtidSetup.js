import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaStore, FaKey, FaEnvelope, FaLock, 
  FaCheckCircle, FaFingerprint, FaUserShield, FaCalendarCheck, FaIdCard, FaFileAlt, 
  FaKeyboard, FaClipboardList, FaComments, FaPaperPlane, FaSpinner 
} from 'react-icons/fa';
import CustomAlert from '../universal/CustomAlert';

function NtidSetup() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const token = localStorage.getItem('token');
  let id;
  if (token) {
    const decodedToken = jwtDecode(token);
    id = decodedToken.id;
  }

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getntidsetup`);
      if (response.status === 200) {
        const data = await response.json();
        setData(data.result);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertMessage("Failed to load data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, phone, ntid) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [phone]: {
        ...prev[phone],
        [ntid]: {
          ...prev[phone]?.[ntid],
          [name]: value,
        },
      },
    }));
  };

  const handleUpdate = async (phone, ntid) => {
    const rowFormData = formData[phone]?.[ntid] || {};

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/insertData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rowFormData, phone, ntid, id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setData((prevData) =>
        prevData.map((item) =>
          item.phone === phone && item.ntid === ntid
            ? {
                ...item,
                yubikey_status: rowFormData.yubiKeyStatus !== undefined ? (rowFormData.yubiKeyStatus === "Yes" ? 1 : 0) : item.yubikey_status,
                ntid_setup_status: rowFormData.ntidSetupStatus !== undefined ? (rowFormData.ntidSetupStatus === "Yes" ? 1 : 0) : item.ntid_setup_status,
                ntid_setup_date: rowFormData.ntidSetupDate || item.ntid_setup_date,
                idv_status: rowFormData.idvStatus !== undefined ? (rowFormData.idvStatus === "Yes" ? 1 : 0) : item.idv_status,
                idv_docu: rowFormData.idvDocu || item.idv_docu,
                yubikey_pin: rowFormData.yubiKeyPin || item.yubikey_pin,
                rtpos_pin: rowFormData.rtposPin || item.rtpos_pin,
                comments: rowFormData.comments || item.comments,
              }
            : item
        )
      );

      setFormData((prev) => {
        const updatedPhoneData = { ...prev[phone] };
        delete updatedPhoneData[ntid];
        return { ...prev, [phone]: updatedPhoneData };
      });

      setAlertMessage(result.message || "NTID setup updated successfully!");
      await getData();
    } catch (error) {
      console.error("Error updating data:", error);
      setAlertMessage(`Failed to update data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = async (phone, ntid) => {
    const item = data.find((d) => d.phone === phone && d.ntid === ntid);
    if (!item.yubikey_status || !item.ntid_setup_status || !item.ntid_setup_date || 
        !item.idv_status || !item.idv_docu || !item.yubikey_pin || !item.rtpos_pin || !item.comments) {
      setAlertMessage("All NTID setup fields must be filled before assigning.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/assignNtidSetup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, ntid, id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setData((prevData) =>
        prevData.map((item) =>
          item.phone === phone && item.ntid === ntid
            ? { ...item, ntid_setup_assigned: true }
            : item
        )
      );
      setAlertMessage(result.message || "NTID setup assigned successfully!");
      await getData();
    } catch (error) {
      console.error("Error assigning data:", error);
      setAlertMessage(`Failed to assign data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFullyFilled = (item) => {
    return (
      item.yubikey_status !== null && item.yubikey_status !== undefined &&
      item.ntid_setup_status !== null && item.ntid_setup_status !== undefined &&
      item.ntid_setup_date &&
      item.idv_status !== null && item.idv_status !== undefined &&
      item.idv_docu &&
      item.yubikey_pin &&
      item.rtpos_pin &&
      item.comments
    );
  };
  const closeAlert = () => setAlertMessage("");


  return (
    <div className="container-fluid py-4">
       {alertMessage && (
        <CustomAlert message={alertMessage} onClose={closeAlert} />
      )}
      <div className="card shadow">
        <div className="card-header text-white text-center" style={{ 
          backgroundImage: "url('/setup.jpg')", 
          width: '100%', 
          height: "8rem", 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: "center" 
        }}>
          <h3 className="mb-0 mt-5">
            <FaKey className="me-2 d-inline" />
            NTID Setup Management
          </h3>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-4">
              <FaSpinner className="me-2 d-inline fa-spin" />
              <span>Loading data...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-pink" style={{ backgroundColor: '#FFB6C1' }}>
                  <tr className="text-nowrap">
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaUser className="me-1" /> First Name</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaUser className="me-1" /> Last Name</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaPhone className="me-1" /> Phone</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaMapMarkerAlt className="me-1" /> Market</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaCalendarAlt className="me-1" /> Joining Date</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaStore className="me-1" /> Main Store</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaKey className="me-1" /> NTID</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaEnvelope className="me-1" /> Email</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaLock className="me-1" /> Password</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaFingerprint className="me-1" /> YUBI Key Availability</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaUserShield className="me-1" /> ID Setup</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaCalendarCheck className="me-1" /> Setup Date</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaIdCard className="me-1" /> IDV Status</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaFileAlt className="me-1" /> IDV Doc</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaKeyboard className="me-1" /> YUBI PIN</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaClipboardList className="me-1" /> RTPOS PIN</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}><FaComments className="me-1" /> Comments</th>
                    <th style={{backgroundColor:'#E10174', color:'white'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const rowFormData = formData[item.phone]?.[item.ntid] || {};
                    const isAssigned = item.ntid_setup_assigned;
                     console.log(isAssigned);
                    const isFilled = isFullyFilled(item);
                    return (
                      <tr key={index}>
                        <td className="text-nowrap">{item.first_name || "-"}</td>
                        <td className="text-nowrap">{item.last_name || "-"}</td>
                        <td className="text-nowrap">{item.phone || "-"}</td>
                        <td className="text-nowrap">{item.market || "-"}</td>
                        <td className="text-nowrap">{item.date_of_joining || "-"}</td>
                        <td className="text-nowrap">{item.mainstore || "-"}</td>
                        <td className="text-nowrap">{item.ntid || "-"}</td>
                        <td className="text-nowrap">{item.t_mobile_email || "-"}</td>
                        <td className="text-nowrap">{item.temp_password || "-"}</td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.yubikey_status === 1 ? "Yes" : item.yubikey_status === 0 ? "No" : "-"}</span>
                          ) : (
                            <select
                              name="yubiKeyStatus"
                              value={rowFormData.yubiKeyStatus || (item.yubikey_status === 1 ? "Yes" : item.yubikey_status === 0 ? "No" : "")}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.ntid_setup_status === 1 ? "Yes" : item.ntid_setup_status === 0 ? "No" : "-"}</span>
                          ) : (
                            <select
                              name="ntidSetupStatus"
                              value={rowFormData.ntidSetupStatus || (item.ntid_setup_status === 1 ? "Yes" : item.ntid_setup_status === 0 ? "No" : "")}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.ntid_setup_date || "-"}</span>
                          ) : (
                            <input
                              type="date"
                              name="ntidSetupDate"
                              value={rowFormData.ntidSetupDate || item.ntid_setup_date || ""}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.idv_status === 1 ? "Yes" : item.idv_status === 0 ? "No" : "-"}</span>
                          ) : (
                            <select
                              name="idvStatus"
                              value={rowFormData.idvStatus || (item.idv_status === 1 ? "Yes" : item.idv_status === 0 ? "No" : "")}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.idv_docu || "-"}</span>
                          ) : (
                            <input
                              type="text"
                              name="idvDocu"
                              value={rowFormData.idvDocu || item.idv_docu || ""}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.yubikey_pin || "-"}</span>
                          ) : (
                            <input
                              type="text"
                              name="yubiKeyPin"
                              value={rowFormData.yubiKeyPin || item.yubikey_pin || ""}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.rtpos_pin || "-"}</span>
                          ) : (
                            <input
                              type="text"
                              name="rtposPin"
                              value={rowFormData.rtposPin || item.rtpos_pin || ""}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge text-dark">{item.comments || "-"}</span>
                          ) : (
                            <input
                              type="text"
                              name="comments"
                              value={rowFormData.comments || item.comments || ""}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          )}
                        </td>
                        <td className="text-nowrap">
                          {isAssigned ? (
                            <span className="badge bg-success">
                              <FaCheckCircle className="me-1" />
                              Assigned
                            </span>
                          ) : isFilled ? (
                            <button
                              className="btn btn-sm text-white bg-success"
                              onClick={() => handleAssign(item.phone, item.ntid)}
                              disabled={isSubmitting}
                            >
                              <FaPaperPlane className="me-1" />
                              {isSubmitting ? "Assigning..." : "Assign"}
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm text-white bg-primary"
                              onClick={() => handleUpdate(item.phone, item.ntid)}
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
}

export default NtidSetup;