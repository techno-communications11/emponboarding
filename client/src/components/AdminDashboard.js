import React from 'react';
import { Table } from 'react-bootstrap';
import { FaCheckCircle } from '@react-icons/all-files/fa/FaCheckCircle';
import { FaTimesCircle as FaTimesCircleRed } from '@react-icons/all-files/fa/FaTimesCircle';

const AdminDashboard = () => {
  const data = [
    { market: 'Arizona', employeesHired: 2, employeesBackedOut: 0, contractsSent: 1, contractsSigned: 1, contractNotReq: 0, contractsPending: 0, ntidsCreated: 2, ntidsDone: 2, ntidsSetupPending: 0, ntidsSetUp: 2, idvDone: 2, idvPending: 0, passport: 0, idDl: 2, left: 1, addressYes: 'Yes', addressNo: 0 },
    { market: 'Dallas', employeesHired: 9, employeesBackedOut: 1, contractsSent: 6, contractsSigned: 6, contractNotReq: 2, contractsPending: 0, ntidsCreated: 8, ntidsDone: 3, ntidsSetupPending: 3, ntidsSetUp: 3, idvDone: 3, idvPending: 2, passport: 2, idDl: 1, left: 2, addressYes: 'Yes', addressNo: 0 },
    { market: 'Denver', employeesHired: 1, employeesBackedOut: 1, contractsSent: 0, contractsSigned: 0, contractNotReq: 0, contractsPending: 0, ntidsCreated: 0, ntidsDone: 0, ntidsSetupPending: 0, ntidsSetUp: 0, idvDone: 0, idvPending: 0, passport: 0, idDl: 0, left: 0, addressYes: 'Yes', addressNo: 0 },
    { market: 'El Paso', employeesHired: 3, employeesBackedOut: 0, contractsSent: 0, contractsSigned: 0, contractNotReq: 3, contractsPending: 0, ntidsCreated: 2, ntidsDone: 1, ntidsSetupPending: 1, ntidsSetUp: 1, idvDone: 1, idvPending: 0, passport: 0, idDl: 1, left: 0, addressYes: 'Yes', addressNo: 0 },
    { market: 'Houston', employeesHired: 13, employeesBackedOut: 1, contractsSent: 10, contractsSigned: 10, contractNotReq: 0, contractsPending: 2, ntidsCreated: 10, ntidsDone: 9, ntidsSetupPending: 1, ntidsSetUp: 9, idvDone: 0, idvPending: 6, passport: 3, idDl: 3, left: 0, addressYes: 'Yes', addressNo: 0 },
    { market: 'Los Angeles', employeesHired: 6, employeesBackedOut: 0, contractsSent: 6, contractsSigned: 6, contractNotReq: 0, contractsPending: 0, ntidsCreated: 6, ntidsDone: 5, ntidsSetupPending: 0, ntidsSetUp: 5, idvDone: 0, idvPending: 2, passport: 3, idDl: 1, left: 1, addressYes: 'Yes', addressNo: 0 },
    { market: 'San Jose', employeesHired: 3, employeesBackedOut: 0, contractsSent: 3, contractsSigned: 3, contractNotReq: 0, contractsPending: 0, ntidsCreated: 2, ntidsDone: 2, ntidsSetupPending: 0, ntidsSetUp: 2, idvDone: 0, idvPending: 2, passport: 0, idDl: 0, left: 0, addressYes: 'Yes', addressNo: 0 },
    { market: 'Solano County', employeesHired: 3, employeesBackedOut: 0, contractsSent: 3, contractsSigned: 3, contractNotReq: 0, contractsPending: 0, ntidsCreated: 3, ntidsDone: 3, ntidsSetupPending: 0, ntidsSetUp: 3, idvDone: 0, idvPending: 2, passport: 1, idDl: 1, left: 0, addressYes: 'Yes', addressNo: 0 },
    { market: 'Sacramento', employeesHired: 1, employeesBackedOut: 0, contractsSent: 1, contractsSigned: 0, contractNotReq: 0, contractsPending: 1, ntidsCreated: 0, ntidsDone: 0, ntidsSetupPending: 0, ntidsSetUp: 0, idvDone: 0, idvPending: 0, passport: 0, idDl: 0, left: 0, addressYes: 'Yes', addressNo: 0 },
  ];

  const grandTotal = {
    market: 'GRAND TOTAL',
    employeesHired: 42,
    employeesBackedOut: 3,
    contractsSent: 31,
    contractsSigned: 30,
    contractNotReq: 5,
    contractsPending: 3,
    ntidsCreated: 34,
    ntidsDone: 26,
    ntidsSetupPending: 5,
    ntidsSetUp: 26,
    idvDone: 6,
    idvPending: 14,
    passport: 12,
    idDl: 4,
    left: 4,
    addressYes: 8,
    addressNo: 0,
  };

  // Helper function to render icons based on status (e.g., for done/pending)
  const renderStatusIcon = (value) => {
    if (value > 0) {
      return <FaCheckCircle color="green" />;
    } else {
      return <FaTimesCircleRed color="red" />;
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center mb-4" style={{ color: '#E10174' }}>
        Techno Communications Onboarding Status Feb 1 - 23
      </h1>
      <Table striped bordered hover responsive>
        <thead >
          <tr >
            <th style={{ backgroundColor: '#E10174', color: 'white' }}> Market</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}> No of Employees Hired</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}> No of Employees Backed Out</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contracts Sent</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contracts Signed</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contract Not Req</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Contracts Pending</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID's Created</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID's Done</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID's Setup Pending</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>NTID's Set Up</th>
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
              <td>{row.employeesHired}</td>
              <td>{row.employeesBackedOut}</td>
              <td>{row.contractsSent}</td>
              <td>{row.contractsSigned}</td>
              <td>{row.contractNotReq}</td>
              <td>{row.contractsPending}</td>
              <td>{row.ntidsCreated}</td>
              <td>{renderStatusIcon(row.ntidsDone)}</td>
              <td>{renderStatusIcon(row.ntidsSetupPending)}</td>
              <td>{renderStatusIcon(row.ntidsSetUp)}</td>
              <td>{renderStatusIcon(row.idvDone)}</td>
              <td>{renderStatusIcon(row.idvPending)}</td>
              <td>{row.passport}</td>
              <td>{row.idDl}</td>
              <td>{row.left}</td>
              <td>{row.addressYes}</td>
              <td>{row.addressNo}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
            <td>{grandTotal.market}</td>
            <td>{grandTotal.employeesHired}</td>
            <td>{grandTotal.employeesBackedOut}</td>
            <td>{grandTotal.contractsSent}</td>
            <td>{grandTotal.contractsSigned}</td>
            <td>{grandTotal.contractNotReq}</td>
            <td>{grandTotal.contractsPending}</td>
            <td>{grandTotal.ntidsCreated}</td>
            <td>{renderStatusIcon(grandTotal.ntidsDone)}</td>
            <td>{renderStatusIcon(grandTotal.ntidsSetupPending)}</td>
            <td>{renderStatusIcon(grandTotal.ntidsSetUp)}</td>
            <td>{renderStatusIcon(grandTotal.idvDone)}</td>
            <td>{renderStatusIcon(grandTotal.idvPending)}</td>
            <td>{grandTotal.passport}</td>
            <td>{grandTotal.idDl}</td>
            <td>{grandTotal.left}</td>
            <td>{grandTotal.addressYes}</td>
            <td>{grandTotal.addressNo}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;