import React, { useState, useEffect } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { LiaFileContractSolid } from "react-icons/lia";
import UploadDocument from "./UploadDocument";
import Modal from "react-bootstrap/Modal";
import CustomAlert from "../universal/CustomAlert";

function Contract() {
  const [rows, setRows] = useState([]); // Assigned contracts
  const [savedRows, setSavedRows] = useState([]); // Unassigned contracts
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
   const [email, setEmail] = useState("");
  const [newRow, setNewRow] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    market: "",
    date_of_joining: "",
    mainstore: "",
    stores_to_be_assigned: "",
    contract: "select",
    contract_sent_date: "",
    contract_sent_to: "",
    contract_sent_by: "",
    contract_signed_on: "",
    backout_status: "select",
    address: false,
    UploadDocument: false,
    assigned: false,
  });
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const closeAlert = () => setAlertMessage("");
  const handleClose = () => setShow(false);
  const handleFile = () => setShow(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getcontract`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRows(data.filter((row) => row.assigned));
      setSavedRows(data.filter((row) => !row.assigned));
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertMessage("Failed to load data. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateRow = (row) => {
    const baseFields = [
      "first_name",
      "last_name",
      "phone",
      "email",
      "market",
      "date_of_joining",
      "mainstore",
      "stores_to_be_assigned",
      "contract"
    ];

    const contractFields = [
      "contract_sent_date",
      "contract_sent_to",
      "contract_sent_by",
      "contract_signed_on"
    ];

    const baseValid = baseFields.every((field) => 
      row[field]?.toString().trim() !== "" && 
      (field !== "contract" || row[field] !== "select")
    );

    if (row.contract === "true") {
      return baseValid && contractFields.every((field) => 
        row[field]?.toString().trim() !== ""
      );
    }

    return baseValid;
  };

  const handleSubmitAndAssign = async (action, id = null, updatedRow = null) => {
    setIsSubmitting(true);
    try {
      if ((action === "update" || action === "assign") && (!id || !updatedRow)) {
        throw new Error("Missing contract ID or data for update/assign");
      }

      if (action === "assign" && !validateRow(updatedRow || newRow)) {
        setAlertMessage(
          (updatedRow?.contract === "true" || newRow.contract === "true")
            ? "All fields up to Contract Signed On are required when Contract is Yes."
            : "All fields up to Contract are required."
        );
        return;
      }

      const endpoint =
        action === "save" ? "savecontract" :
        action === "update" ? `updatecontract/${id}` :
        `assigncontract/${id}`;

      const url = `${process.env.REACT_APP_BASE_URL}/${endpoint}`;
      const payload = action === "save" 
        ? { 
            ...newRow, 
            contract: newRow.contract === "true" ? true : newRow.contract === "false" ? false : newRow.contract,
            backout_status: newRow.backout_status === "true" ? true : newRow.backout_status === "false" ? false : newRow.backout_status
          } 
        : { 
            ...updatedRow, 
            id: undefined,
            contract: updatedRow.contract === "true" ? true : updatedRow.contract === "false" ? false : updatedRow.contract,
            backout_status: updatedRow.backout_status === "true" ? true : updatedRow.backout_status === "false" ? false : updatedRow.backout_status
          };

      const response = await fetch(url, {
        method: action === "save" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setAlertMessage(responseData.message);

      if (action === "save") {
        setNewRow({
          first_name: "", last_name: "", phone: "", email: "", market: "",
          date_of_joining: "", mainstore: "", stores_to_be_assigned: "",
          contract: "select", contract_sent_date: "", contract_sent_to: "",
          contract_sent_by: "", contract_signed_on: "", backout_status: "select",
          address: false, UploadDocument: false, assigned: false,
        });
      }

      await fetchData();
    } catch (error) {
      console.error(`Error ${action}ing data:`, error);
      setAlertMessage(`Failed to ${action} data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditField = (index, field, value) => {
    const updatedRows = [...savedRows];
    updatedRows[index] = { 
      ...updatedRows[index], 
      [field]: typeof value === "boolean" ? value : value 
    };
    setSavedRows(updatedRows);
    setEditingField(null); // Exit edit mode after selection
  };

  const renderTableHeaders = () => {
    return Object.keys(newRow).map((header) => (
      <th
        style={{ backgroundColor: "#E10174", color: "white" }}
        className="text-nowrap"
        key={header}
      >
        {header.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
      </th>
    ));
  };

  const renderNewContractForm = () => {
    return (
      <tr>
        {Object.keys(newRow).map((field) => (
          <td key={field} className="text-nowrap">
            {field === "assigned" ? (
              <Button
                variant="primary"
                onClick={() => handleSubmitAndAssign("save")}
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            ) : field === "contract" || field === "backout_status" ? (
              <select
                name={field}
                value={newRow[field]}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                style={{ width: "150px" }}
              >
                <option value="select">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : field === "address" ? (
              <input
                className="text-center"
                type="checkbox"
                name={field}
                checked={newRow[field]}
                onChange={handleInputChange}
              />
            ) : field === "UploadDocument" ? (
              <Button
                onClick={handleFile}
                className="btn btn-warning text-primary fw-bolder border-warning bg-transparent"
                size="sm"
              >
                Add Document
              </Button>
            ) : (
              <input
                type={["date_of_joining", "contract_sent_date", "contract_signed_on"]
                  .includes(field) ? "date" : "text"}
                name={field}
                value={newRow[field]}
                style={{ width: "150px" }}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder={`Enter ${field.replace(/_/g, " ")}`}
              />
            )}
          </td>
        ))}
      </tr>
    );
  };

  const renderSavedRows = () => {
    return savedRows.map((row, index) => {
      const isRowComplete = validateRow(row);
  
      return (
        <tr key={row.id || index}>
          {Object.keys(newRow).map((field) => (
            <td key={field} className="text-nowrap">
              {field === "UploadDocument" ? (
                <Button
                  onClick={handleFile}
                  className="btn btn-warning text-dark fw-bolder border bg-transparent"
                  size="sm"
                >
                  Add Document
                </Button>
              ) : field === "assigned" ? (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const cleanRow = { ...row };
                      delete cleanRow.id;
                      handleSubmitAndAssign("update", row.id, cleanRow);
                    }}
                    disabled={isSubmitting}
                  >
                    Update
                  </Button>
                  {!row.assigned && isRowComplete && (
                    <Button
                      variant="success"
                      size="sm"
                      className="ms-2"
                      onClick={() => {
                        const cleanRow = { ...row };
                        delete cleanRow.id;
                        handleSubmitAndAssign("assign", row.id, {
                          ...cleanRow,
                          assigned: true,
                        });
                      }}
                      disabled={isSubmitting}
                    >
                      Assign
                    </Button>
                  )}
                </>
              ) : field === "contract" || field === "backout_status" ? (
                editingField === `${index}-${field}` ? (
                  <select
                    name={field}
                    value={row[field]?.toString() || "select"}
                    onChange={(e) => handleEditField(index, field, e.target.value)}
                    className="form-control form-control-sm"
                    style={{ minWidth: "100px" }}
                  >
                    <option value="select">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  row[field] === "select" || row[field] === "" || row[field] === null || row[field] === undefined ? (
                    <select
                      name={field}
                      value={row[field]?.toString() || "select"}
                      onChange={(e) => handleEditField(index, field, e.target.value)}
                      className="form-control form-control-sm"
                      style={{ minWidth: "100px" }}
                    >
                      <option value="select">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <Badge
                      bg="transparent"
                      className="py-2 px-5 ms-2 rounded-2 text-center text-black border"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditingField(`${index}-${field}`)}
                    >
                      { row[field]  ? "Yes" : "No"}
                    </Badge>
                  )
                )
              ) : field === "address" ? (
                <input
                  className="text-center"
                  type="checkbox"
                  name={field}
                  checked={row[field] || false}
                  onChange={(e) => handleEditField(index, field, e.target.checked)}
                />
              ) : ["date_of_joining", "contract_sent_date", "contract_signed_on"].includes(field) ? (
                row[field] ? (
                  <input
                    type="text"
                    name={field}
                    value={row[field] || ""}
                    onChange={(e) => handleEditField(index, field, e.target.value)}
                    className="form-control form-control-sm"
                    style={{ minWidth: "100px" }}
                  />
                ) : (
                  <input
                    type="date"
                    name={field}
                    value={row[field] || ""}
                    onChange={(e) => handleEditField(index, field, e.target.value)}
                    className="form-control form-control-sm"
                    style={{ minWidth: "100px" }}
                  />
                )
              ) : (
                <input
                  type="text"
                  name={field}
                  value={row[field] || ""}
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  onChange={(e) => handleEditField(index, field, e.target.value)}
                  className="form-control form-control-sm"
                  style={{ minWidth: "100px" }}
                />
              )}
            </td>
          ))}
        </tr>
      );
    });
  };

  const renderAssignedRows = () => {
    return rows.map((row) => {
      // Optionally set email for the first row or a specific condition
      if (!email && row.email) { // Example: Set email only if not already set
        setEmail(row.email);
        console.log(row.email, 'sent email');
      }

      return (
        <tr key={row.id}>
          {Object.keys(newRow).map((field) => (
            <td key={field} className="text-nowrap text-center">
              {field === "assigned" ? (
                <Button variant="success" size="sm" disabled>
                  Assigned
                </Button>
              ) : field === "UploadDocument" ? (
                <Button
                  onClick={handleFile}
                  className="btn btn-warning text-dark fw-bolder border bg-transparent"
                  size="sm"
                >
                  Add Document
                </Button>
              ) : field === "address" ? (
                <input
                  type="checkbox"
                  checked={row[field] || false}
                  disabled
                />
              ) : field === "contract" || field === "backout_status" ? (
                row[field] ? "Yes" : "No"
              ) : (
                row[field] || "-"
              )}
            </td>
          ))}
        </tr>
      );
    });
  };

  return (
    <div className="bg-white">
      {alertMessage && (
        <CustomAlert message={alertMessage} onClose={closeAlert} />
      )}
      <Container fluid className="p-1">
        <div className="border shadow-sm">
          <div
            className="p-1 border-bottom"
            style={{
              backgroundImage: "url('/contract.jpg')",
              width: "100%",
              height: "8rem",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="d-flex flex-row align-items-center justify-content-between w-100 mt-5">
              <h1 className="m-0 text-white fw-bolder text-center flex-grow-1">
                <LiaFileContractSolid /> Contracts Sign
              </h1>
            </div>
          </div>
          <div className="table-responsive">
            <Table className="table-bordered mb-0">
              <thead>
                <tr>{renderTableHeaders()}</tr>
              </thead>
              <tbody>
                {renderNewContractForm()}
                {renderSavedRows()}
                {renderAssignedRows()}
              </tbody>
            </Table>
          </div>
        </div>
        <Modal show={show} onHide={handleClose} size="md">
  <Modal.Body>
   
      <UploadDocument email={email} />
    
  </Modal.Body>
</Modal>

      </Container>
    </div>
  );
}

export default Contract;