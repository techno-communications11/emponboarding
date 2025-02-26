import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { 
  UserCircle, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  Mail,
  GraduationCap,
  CheckCircle,
  Clock
} from 'lucide-react';

const TrainingData = () => {
    const [trainingData, setTrainingData] = useState([]);
    const [updateData, setUpdateData] = useState({});
    const [updatedRows, setUpdatedRows] = useState({});

    const token = localStorage.getItem('token');
    let id;

    if (token) {
        const decodedToken = jwtDecode(token);
        id = decodedToken.id;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/gettrainingdata`);
                const data = await response.json();
                setTrainingData(data);
                 console.log(data)
                const storedUpdatedRows = JSON.parse(localStorage.getItem('updatedRows')) || {};
                setUpdatedRows(storedUpdatedRows);
            } catch (error) {
                console.error('Error fetching training data:', error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e, phone) => {
        const { name, value } = e.target;
        setUpdateData({
            ...updateData,
            [phone]: {
                ...updateData[phone],
                [name]: value
            }
        });
    };

    const handleUpdate = async (phone) => {
        const rowData = updateData[phone];
        if (!rowData || !rowData.TrainingStatus || !rowData.TrainingCompletedDate) {
            alert('Training Status and Training Completed Date are required');
            return;
        }

        try {
            if (updatedRows[phone]) {
                alert('This row has already been updated');
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/insert-training-data`, {
                phone,
                id,
                ...rowData
            });

            setTrainingData((prevData) =>
                prevData.map((row) =>
                    row.phone === phone
                        ? { ...row, training_status: rowData.TrainingStatus, training_completed_date: rowData.TrainingCompletedDate }
                        : row
                )
            );

            const updatedRowsCopy = { ...updatedRows, [phone]: true };
            setUpdatedRows(updatedRowsCopy);
            localStorage.setItem('updatedRows', JSON.stringify(updatedRowsCopy));
            
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating training data:', error);
            alert('Failed to update data');
        }
    };

    return (
        <div className="container-fluid py-1">
            <div className="card shadow">
            <div className="card-header text-dark"
             style={{ backgroundImage: "url('/training.jpg')", 
             height: "8rem", backgroundRepeat:'no-repeat', backgroundPosition: "center" }}>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered align-middle">
                        <thead className="custom-header">
                                <tr >
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <UserCircle className="me-1" size={18} /> Name
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <Phone className="me-1" size={18} /> Phone
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <MapPin className="me-1" size={18} /> Market
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <Calendar className="me-1" size={18} /> Date of Joining
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <Building className="me-1" size={18} /> MainStore
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <UserCircle className="me-1" size={18} /> NTID
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <Mail className="me-1" size={18} /> T Mobile Email
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <Clock className="me-1" size={18} /> NTID Setup Date
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <GraduationCap className="me-1" size={18} /> Training Status
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
                                        <Calendar className="me-1" size={18} /> Training Completed
                                    </th>
                                    <th className="text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingData.length > 0 ? (
                                    trainingData.map((data, index) => (
                                        <tr key={index}>
                                            <td className="text-nowrap">{data.name}</td>
                                            <td className="text-nowrap">{data.phone}</td>
                                            <td className="text-nowrap">{data.market}</td>
                                            <td className="text-nowrap">{data.date_of_joining}</td>
                                            <td className="text-nowrap">{data.mainstore}</td>
                                            <td className="text-nowrap">{data.ntid}</td>
                                            <td className="text-nowrap">{data.t_mobile_email}</td>
                                            <td className="text-nowrap">{data.ntid_setup_date}</td>
                                            <td className="text-nowrap">
                                                {data.training_status ? (
                                                    <span className=" bg- text-dark">
                                                        {data.training_status}
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        name="TrainingStatus"
                                                        value={updateData[data.phone]?.TrainingStatus || ''}
                                                        onChange={(e) => handleInputChange(e, data.phone)}
                                                        placeholder="Enter Status"
                                                    />
                                                )}
                                            </td>
                                            <td className="text-nowrap">
                                                {data.training_completed_date ? (
                                                    <span className=" text-dark">
                                                        {data.training_completed_date}
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="date"
                                                        className="form-control form-control-sm"
                                                        name="TrainingCompletedDate"
                                                        value={updateData[data.phone]?.TrainingCompletedDate || ''}
                                                        onChange={(e) => handleInputChange(e, data.phone)}
                                                    />
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
                                        <td colSpan="11" className="text-center">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TrainingData;