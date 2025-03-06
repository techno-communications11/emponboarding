import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [grandTotal, setGrandTotal] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getadmindata`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // console.log('Response:', response);
        const result = await response.json();
        // console.log('Result:', result.result[0]);

        if (!result.success) {
          throw new Error(result.resut.message || 'Failed to fetch data');
        }

        const fetchedData = result.result[0]; // Access the 'data' property
        // console.log('Fetched Data:', fetchedData);

        const totals = fetchedData.reduce((acc, row) => {
          Object.keys(row).forEach(key => {
            if (typeof row[key] === 'number') {
              acc[key] = (acc[key] || 0) + row[key];
            }
          });
          return acc;
        }, {});

        totals.market = 'GRAND TOTAL';
        setData(fetchedData);
        setGrandTotal(totals);
        // console.log('Totals:', totals);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center mb-4" style={{ color: '#E10174' }}>
        Techno Communications Onboarding Status Feb 1 - 23
      </h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
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
            {/* <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID Set Up</th> */}
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
              <td>{row.market}</td>
              <td>{row.employeesHired ||0}</td>
              <td>{row.employeesBackedOut ||0}</td>
              <td>{row.contractsSent ||0}</td>
              <td>{row.contractsSigned ||0}</td>
              <td>{row.contractNotReq ||0}</td>
              <td>{row.contractsPending ||0}</td>
              <td>{row.ntidsCreated ||0}</td>
              <td>{row.ntidsDone ||0}</td>
              <td>{row.ntidsSetupPending ||0}</td>
              {/* <td>{row.ntidsSetUp ||0}</td> */}
              <td>{row.idvDone ||0}</td>
              <td>{row.idvPending ||0}</td>
              <td>{row.passport ||0}</td>
              <td>{row.idDl ||0}</td>
              <td>{row.left ||0}</td>
              <td>{row.addressYes ||0}</td>
              <td>{row.addressNo ||0}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
            <td>{grandTotal.market}</td>
            <td>{grandTotal.employeesHired ||0}</td>
            <td>{grandTotal.employeesBackedOut ||0}</td>
            <td>{grandTotal.contractsSent ||0}</td>
            <td>{grandTotal.contractsSigned ||0}</td>
            <td>{grandTotal.contractNotReq ||0}</td>
            <td>{grandTotal.contractsPending ||0}</td>
            <td>{grandTotal.ntidsCreated||0}</td>
            <td>{grandTotal.ntidsDone ||0}</td>
            <td>{grandTotal.ntidsSetupPending ||0}</td>
            {/* <td>{grandTotal.ntidsSetUp}</td> */}
            <td>{grandTotal.idvDone||0}</td>
            <td>{grandTotal.idvPending ||0}</td>
            <td>{grandTotal.passport ||0}</td>
            <td>{grandTotal.idDl ||0}</td>
            <td>{grandTotal.left ||0}</td>
            <td>{grandTotal.addressYes ||0}</td>
            <td>{grandTotal.addressNo ||0}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;