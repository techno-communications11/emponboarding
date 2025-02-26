import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
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
  CheckCircle
} from 'lucide-react';

const NtidCreation = () => {
  const [mergedRows, setMergedRows] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const token = localStorage.getItem('token');
  let id;
  if (token) {
    const decodedToken = jwtDecode(token);
    id = decodedToken.id;
  } else {
    console.error('Token not found');
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch data from both endpoints
      const [contractResponse, ntidResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_BASE_URL}/getcontract`),
        fetch(`${process.env.REACT_APP_BASE_URL}/getntidcreation`),
      ]);

      if (!contractResponse.ok || !ntidResponse.ok) {
        throw new Error("Failed to fetch data from one or more endpoints");
      }

      const contractData = await contractResponse.json();
      const ntidData = await ntidResponse.json();

      // Merge the two datasets
      const mergedData = mergeData(contractData, ntidData);

      // Update state with merged data
      setMergedRows(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please refresh the page.");
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
  const handleSubmit = async (row) => {
    const rowFormData = formData[row.phone];
    if (!rowFormData?.ntid || !rowFormData?.t_mobile_email || !rowFormData?.temp_password) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/assign-ntid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rowFormData, phone: row.phone, id }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.status === 201) {
        // Update the rows state immediately
        setMergedRows((prevRows) =>
          prevRows.map((r) =>
            r.phone === row.phone
              ? {
                  ...r,
                  ntid: rowFormData.ntid,
                  ntid_created_on: rowFormData.ntid_created_on,
                  t_mobile_email: rowFormData.t_mobile_email,
                  temp_password: rowFormData.temp_password,
                }
              : r
          )
        );
  
        // Clear the form data for this row
        setFormData((prev) => ({ ...prev, [row.phone]: null }));
  
        alert(result.message || "Data submitted successfully!");
      } else {
        throw new Error(result.error || "Failed to assign NTID");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Failed to submit data: ${error.message}`);
    }
  };
   

  return (
    <div className="container-fluid py-4">
      <div className="card shadow">
        <div className="card-header text-center  bg-primary text-white" style={{ backgroundImage: "url('/ntid.avif')", 
            width:'100%', height: "8rem", backgroundRepeat:'no-repeat', backgroundPosition: "center" }}>
          <h3 className="mb-0 mt-5">
            <Key className="me-2 d-inline" size={24} />
            NTID Creation Management
          </h3>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-4">
              <Loader className="me-2 d-inline animate-spin" size={24} />
              <span>Loading data...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle" style={{ width: '100%' }}>
                <thead className="table-light">
                  <tr className="text-nowrap">
                    <th style={{backgroundColor:'#E01074', color:'white'}}><User className="me-1" size={16} /> Name</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Mail className="me-1" size={16} /> Email</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Phone className="me-1" size={16} /> Phone</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><MapPin className="me-1" size={16} /> Market</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Store className="me-1" size={16} /> Main Store</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Calendar className="me-1" size={16} /> Date of Joining</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Grid className="me-1" size={16} /> Stores Assigned</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><FileText className="me-1" size={16} /> Contract</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Clock className="me-1" size={16} /> NTID Created On</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Key className="me-1" size={16} /> NTID</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Mail className="me-1" size={16} /> T Mobile Email</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Lock className="me-1" size={16} /> Temp Password</th>
                    <th style={{backgroundColor:'#E01074', color:'white'}}><Send className="me-1" size={16} /> Action</th>
                  </tr >
                </thead>
                <tbody>
                  {mergedRows.map((row, index) => {
                    const rowFormData = formData[row.phone] || {};
                    return (
                      <tr key={index} >
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.name}</td>
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.email}</td>
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.phone}</td>
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.market}</td>
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.mainstore}</td>
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.date_of_joining}</td>
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.stores_to_be_assigned}</td>
                        <td style={{ whiteSpace: 'normal' }} className="text-nowrap">{row.contract}</td>
                        
                        <td>
                          {!row.ntid_created_on ? (
                            <input
                              type="date"
                              name="ntid_created_on"
                              value={rowFormData.ntid_created_on || ''}
                              style={{width: '150px'}}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                            />
                          ) : (
                            <span className="text-nowrap">{row.ntid_created_on}</span>
                          )}
                        </td>
                        <td>
                          {!row.ntid ? (
                            <input
                              type="text"
                              name="ntid"
                              style={{width: '150px'}}
                              value={rowFormData.ntid || ''}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                              placeholder="Enter NTID"
                            />
                          ) : (
                            <span className="text-nowrap">{row.ntid}</span>
                          )}
                        </td>
                        <td>
                          {!row.t_mobile_email ? (
                            <input
                              type="email"
                              style={{width: '150px'}}
                              name="t_mobile_email"
                              value={rowFormData.t_mobile_email || ''}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                              placeholder="Enter email"
                            />
                          ) : (
                            <span className="text-nowrap">{row.t_mobile_email}</span>
                          )}
                        </td>
                        <td>
                          {!row.temp_password ? (
                            <input
                              type="password"
                              name="temp_password"
                              style={{width: '150px'}}
                              value={rowFormData.temp_password || ''}
                              onChange={(e) => handleInputChange(e, row.phone)}
                              className="form-control form-control-sm"
                              placeholder="Enter password"
                            />
                          ) : (
                            <span className="text-nowrap">{row.temp_password }</span>
                          )}
                        </td>
                        <td className="text-center"  >
                          {!row.temp_password ? (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{width: '150px'}}
                              onClick={() => handleSubmit(row)}
                            >
                              <Send className="me-1" size={14}  />
                              Assign
                            </button>
                          ) : (
                            <span className="badge bg-success" style={{width: '150px'}}>
                              <CheckCircle className="me-1" size={14} />
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
};

export default NtidCreation;