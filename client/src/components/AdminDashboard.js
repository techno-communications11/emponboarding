import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'react-bootstrap';

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
  }, [startDate, endDate]); // Fetch data when startDate or endDate changes

  return (
    <div className="container-fluid mt-4">
      <Row className="shadow-md p-4">
        <Col md={6}>
          <label style={{ color: '#E10174' }} className="fw-bolder">
            Start Date
          </label>
          <input
            type="date"
            className="form-control border-primary fw-bolder"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <label style={{ color: '#E10174' }} className="fw-bolder">
            End Date
          </label>
          <input
            type="date"
            className="form-control border-primary"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Col>
      </Row>
      <h1 className="text-center mb-4" style={{ color: '#E10174' }}>
        Techno Communications Onboarding Status
      </h1>
   
  <Table striped bordered hover responsive className="text-center align-middle">
    <thead>
      <tr >
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Market</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>No of Employees Hired</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>No of Employees Backed Out</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contracts Sent</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contracts Signed</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contract Not Req</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contracts Pending</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID Created</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID SetUp Done</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID Setup Pending</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>IDV Done</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>IDV Pending</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Passport</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>ID/DL</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Left</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Address Yes</th>
        <th style={{ backgroundColor: '#E10174', color: 'white' }}>Address No</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td >{row.market}</td>
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
      <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
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


  );
};

export default AdminDashboard;
