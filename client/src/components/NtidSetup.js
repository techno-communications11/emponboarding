import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaStore,
  FaKey, 
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaFingerprint,
  FaUserShield,
  FaCalendarCheck,
  FaIdCard,
  FaFileAlt,
  FaKeyboard,
  FaClipboardList,
  FaComments,
  FaPaperPlane,
  FaSpinner
} from 'react-icons/fa';

function NtidSetup() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
      alert("Failed to load data. Please refresh the page.");
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

  const handleSubmit = async (phone, ntid) => {
    const rowFormData = formData[phone]?.[ntid];
    if (!rowFormData) {
      alert("Please fill out the form for this row.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/insertData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rowFormData, phone, ntid, id }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Data inserted successfully!");

        setData((prevData) =>
          prevData.map((item) =>
            item.phone === phone && item.ntid === ntid
              ? {
                  ...item,
                  yubikey_status: rowFormData.yubiKeyStatus || item.yubikey_status,
                  ntid_setup_status: rowFormData.ntidSetupStatus || item.ntid_setup_status,
                  ntid_setup_date: rowFormData.ntidSetupDate || item.ntid_setup_date,
                  idv_status: rowFormData.idvStatus || item.idv_status,
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
      } else {
        throw new Error(`Failed to insert data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Failed to submit data: ${error.message}`);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow">
      <div className="card-header text-white text-center" style={{ backgroundImage: "url('/setup.jpg')", 
            width:'100%', height: "8rem", backgroundRepeat:'no-repeat', backgroundPosition: "center" }} >

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
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaUser className="me-1" /> Name</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaPhone className="me-1" /> Phone</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaMapMarkerAlt className="me-1" /> Market</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaCalendarAlt className="me-1" /> Joining Date</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaStore className="me-1" /> Main Store</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaKey className="me-1" /> NTID</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaEnvelope className="me-1" /> Email</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaLock className="me-1" /> Password</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaFingerprint className="me-1" /> YUBI key avilability</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaUserShield className="me-1" /> ID setup</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaCalendarCheck className="me-1" /> Setup Date</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaIdCard className="me-1" /> IDV Status</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaFileAlt className="me-1" /> IDV Doc</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaKeyboard className="me-1" /> YUBI PIN</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaClipboardList className="me-1" /> RTPOS PIN</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}><FaComments className="me-1" /> Comments</th>
                    <th style={{backgroundColor:'#E10174',color:'white'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const rowFormData = formData[item.phone]?.[item.ntid] || {};
                    return (
                      <tr key={index}>
                        <td className="text-nowrap">{item.name}</td>
                        <td className="text-nowrap">{item.phone}</td>
                        <td className="text-nowrap">{item.market}</td>
                        <td className="text-nowrap">{item.date_of_joining}</td>
                        <td className="text-nowrap">{item.mainstore}</td>
                        <td className="text-nowrap">{item.ntid}</td>
                        <td className="text-nowrap">{item.t_mobile_email}</td>
                        <td className="text-nowrap">{item.temp_password}</td>
                        <td className="text-nowrap">
                          {item.yubikey_status === null ? (
                            <input
                              type="text"
                              name="yubiKeyStatus"
                              value={rowFormData.yubiKeyStatus || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.yubikey_status}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {item.ntid_setup_status === null ? (
                            <input
                              type="text"
                              name="ntidSetupStatus"
                              value={rowFormData.ntidSetupStatus || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.ntid_setup_status}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {item.ntid_setup_date === null ? (
                            <input
                              type="date"
                              name="ntidSetupDate"
                              value={rowFormData.ntidSetupDate || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.ntid_setup_date}
                            </span>
                          )}
                        </td  >
                        <td className="text-nowrap">
                          {item.idv_status === null ? (
                            <input
                              type="text"
                              name="idvStatus"
                              value={rowFormData.idvStatus || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.idv_status}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {item.idv_docu === null ? (
                            <input
                              type="text"
                              name="idvDocu"
                              value={rowFormData.idvDocu || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.idv_docu}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {item.yubikey_pin === null ? (
                            <input
                              type="password"
                              name="yubiKeyPin"
                              value={rowFormData.yubiKeyPin || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.rtpos_pin}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {item.rtpos_pin === null ? (
                            <input
                              type="password"
                              name="rtposPin"
                              value={rowFormData.rtposPin || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.rtpos_pin}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {item.comments === null ? (
                            <input
                              type="text"
                              name="comments"
                              value={rowFormData.comments || ''}
                              onChange={(e) => handleInputChange(e, item.phone, item.ntid)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="badge text-dark">
                              {item.comments}
                            </span>
                          )}
                        </td>
                        <td className="text-nowrap">
                          {item.ntid_setup_date === null ? (
                            <button
                              className="btn btn-sm text-white bg-primary"
                              onClick={() => handleSubmit(item.phone, item.ntid)}
                            >
                              <FaPaperPlane className="me-1 " />
                              Assign
                            </button>
                          ) : (
                            <span className="badge bg-success">
                              <FaCheckCircle className="me-1" />
                              Assigned
                            </span>
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