import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { LiaFileContractSolid } from "react-icons/lia";
import CustomAlert from "./CustomAlert";
function Contract() {
  const [rows, setRows] = useState([]); // Assigned contracts
  const [savedRows, setSavedRows] = useState([]); // Unassigned contracts
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [newRow, setNewRow] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    market: "",
    date_of_joining: "",
    mainstore: "",
    stores_to_be_assigned: "",
    contract: "",
    contract_sent_date: "",
    contract_sent_to: "",
    contract_sent_by: "",
    contract_signed_on: "",
    backout_status: "",
    address: false,
    assigned: false,
  });
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);
  const closeAlert = () => {
    setAlertMessage("");
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/getcontract`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRows(data.filter((row) => row.assigned));
      setSavedRows(data.filter((row) => !row.assigned));
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const validateRow = (row) => {
    return Object.keys(newRow)
      .filter((field) => field !== "assigned")
      .every((field) => row[field]?.trim() !== "");
  };

  const handleSubmitAndAssign = async (
    action,
    id = null,
    updatedRow = null
  ) => {
    setIsSubmitting(true);
    try {
      if (
        (action === "update" || action === "assign") &&
        (!id || !updatedRow)
      ) {
        throw new Error("Missing contract ID or data for update/assign");
      }

      if (action === "assign" && !validateRow(updatedRow || newRow)) {
        setAlertMessage(
          "All fields must be filled before assigning. Please update the data."
        );
        setIsSubmitting(false);
        return;
      }

      const endpoint =
        action === "save"
          ? "savecontract"
          : action === "update"
          ? `updatecontract/${id}`
          : `assigncontract/${id}`;

      const url = `${process.env.REACT_APP_BASE_URL}/${endpoint}`;
      const payload =
        action === "save" ? newRow : { ...updatedRow, id: undefined };

      const response = await fetch(url, {
        method: action === "save" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.error || `HTTP error! status: ${response.status}`;
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status}, response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setAlertMessage(responseData.message);
      // alert(responseData.message);

      if (action === "save") {
        setNewRow({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          market: "",
          date_of_joining: "",
          mainstore: "",
          stores_to_be_assigned: "",
          contract: "",
          contract_sent_date: "",
          contract_sent_to: "",
          contract_sent_by: "",
          contract_signed_on: "",
          backout_status: "",
          address: false,
          assigned: false,
        });
      }

      await fetchData();
    } catch (error) {
      console.error(`Error ${action}ing data:`, error);
      alert(`Failed to ${action} data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditField = (index, field, value) => {
    const updatedRows = [...savedRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setSavedRows(updatedRows);
  };

  const renderTableHeaders = () => {
    return Object.keys(newRow).map((header) => (
      <th
        style={{ backgroundColor: "#E10174", color: "white" }}
        className="text-nowrap"
        key={header}
      >
        {header
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .trim()}
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
            ) : (
              <input
                type={
                  [
                    "date_of_joining",
                    "contract_sent_date",
                    "contract_signed_on",
                  ].includes(field)
                    ? "date"
                    : "text"
                }
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
      const hasNullFields = Object.keys(row).some(
        (key) => !row[key] || row[key] === null
      );
      const isRowComplete = hasNullFields;

      return (
        <tr key={row.id || index}>
          {Object.keys(newRow).map((field) => (
            <td key={field} className="text-nowrap">
              {field === "assigned" ? (
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
                  {isRowComplete && !row.assigned && (
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
              ) : row[field] ? (
                <input
                  type="text"
                  name={field}
                  value={row[field] || ""}
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  onChange={(e) =>
                    handleEditField(index, field, e.target.value)
                  }
                  className="form-control form-control-sm"
                  style={{ minWidth: "100px" }}
                />
              ) : (
                <input
                  type={
                    [
                      "date_of_joining",
                      "contract_sent_date",
                      "contract_signed_on",
                    ].includes(field)
                      ? "date"
                      : "text"
                  }
                  name={field}
                  value={row[field] || ""}
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  onChange={(e) =>
                    handleEditField(index, field, e.target.value)
                  }
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
    return rows.map((row) => (
      <tr key={row.id}>
        {Object.keys(newRow).map((field) => (
          <td key={field} className="text-nowrap">
            {field === "assigned" ? (
              <Button variant="success" size="sm" disabled>
                Assigned
              </Button>
            ) : (
              row[field] || "-"
            )}
          </td>
        ))}
      </tr>
    ));
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
              <Button className="btn btn-warning text-white fw-bolder border bg-transparent me-5">
                Add Document
              </Button>
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
      </Container>
    </div>
  );
}

export default Contract;
