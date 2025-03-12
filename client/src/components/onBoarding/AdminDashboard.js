import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import './Styles/admin.css'

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [grandTotal, setGrandTotal] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getadmindata`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.result.message || 'Failed to fetch data');
        }

        const fetchedData = result.result[0];

        // Convert dates to timestamps for accurate filtering
        const startTimestamp = startDate ? new Date(startDate).getTime() : null;
        const endTimestamp = endDate ? new Date(endDate).getTime() + 86400000 - 1 : null; // Include the full end day

        const filteredData = fetchedData.filter((row) => {
          const createdTimestamp = new Date(row.createdat).getTime();
          return (
            (!startTimestamp || createdTimestamp >= startTimestamp) &&
            (!endTimestamp || createdTimestamp <= endTimestamp)
          );
        });

        const totals = filteredData.reduce((acc, row) => {
          Object.keys(row).forEach((key) => {
            if (typeof row[key] === 'number') {
              acc[key] = (acc[key] || 0) + row[key];
            }
          });
          return acc;
        }, {});

        totals.market = 'GRAND TOTAL';

        setData(filteredData);
        setGrandTotal(totals);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

  return (
    <div className="container-fluid mt-2">
      {/* Header Section */}
     
      <Row className="my-1 bg-transparent rounded-3">
        <Col md={2}>
          <label className="fw-bold" style={{color:'#E10174'}}>Start Date</label>
          <input
            type="date"
            className="form-control border-primary"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <label className="fw-bold " style={{color:'#E10174'}}>End Date</label>
          <input
            type="date"
            className="form-control border-primary"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Col>
      </Row>
      {/* Title Section */}
      <h1 className="text-center mb-4 fw-bold" style={{ color: '#E10174' }}>
      {`Techno Communications Onboarding Status ${formatDate(startDate)} - ${formatDate(endDate)}`}
    </h1>


    
      {/* Table Section */}
      <div className="table-responsive shadow-sm rounded-3 overflow-hidden">
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle text-center"
          style={{ backgroundColor: '#fff' }}
        >
          <thead className="bg-primary text-white">
            <tr >
              <th style={{backgroundColor:"#E10174",color:'white'}}>Market</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>No of Employees Hired</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>No of Employees Backed Out</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Contracts Sent</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Contracts Signed</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Contract Not Req</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Contracts Pending</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>NTID Created</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>NTID SetUp Done</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>NTID Setup Pending</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>IDV Done</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>IDV Pending</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Passport</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>ID/DL</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Left</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Address Yes</th>
              <th style={{backgroundColor:"#E10174",color:'white'}}>Address No</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.market}</td>
                <td>{row.employeesHired || 0}</td>
                <td>{row.employeesBackedOut || 0}</td>
                <td>{row.contractsSent || 0}</td>
                <td>{row.contractsSigned || 0}</td>
                <td>{row.contractNotReq || 0}</td>
                <td>{row.contractsPending || 0}</td>
                <td>{row.ntidsCreated || 0}</td>
                <td>{row.ntidsDone || 0}</td>
                <td>{row.ntidsSetupPending || 0}</td>
                <td>{row.idvDone || 0}</td>
                <td>{row.idvPending || 0}</td>
                <td>{row.passport || 0}</td>
                <td>{row.idDl || 0}</td>
                <td>{row.left || 0}</td>
                <td>{row.addressYes || 0}</td>
                <td>{row.addressNo || 0}</td>
              </tr>
            ))}
            <tr className="fw-bold bg-light">
              <td>{grandTotal.market}</td>
              <td>{grandTotal.employeesHired || 0}</td>
              <td>{grandTotal.employeesBackedOut || 0}</td>
              <td>{grandTotal.contractsSent || 0}</td>
              <td>{grandTotal.contractsSigned || 0}</td>
              <td>{grandTotal.contractNotReq || 0}</td>
              <td>{grandTotal.contractsPending || 0}</td>
              <td>{grandTotal.ntidsCreated || 0}</td>
              <td>{grandTotal.ntidsDone || 0}</td>
              <td>{grandTotal.ntidsSetupPending || 0}</td>
              <td>{grandTotal.idvDone || 0}</td>
              <td>{grandTotal.idvPending || 0}</td>
              <td>{grandTotal.passport || 0}</td>
              <td>{grandTotal.idDl || 0}</td>
              <td>{grandTotal.left || 0}</td>
              <td>{grandTotal.addressYes || 0}</td>
              <td>{grandTotal.addressNo || 0}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;