import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { LiaFileContractSolid } from "react-icons/lia";


function Contract() {
  const [rows, setRows] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRow, setNewRow] = useState({
    name: "",
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
    assigned: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getcontract`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please refresh the page.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAndAssign = async () => {
    // Ensure all fields are filled out before submitting
    const fieldsToValidate = { ...newRow };
    delete fieldsToValidate.assigned;  // Exclude this field from validation
    
    // Check if any of the required fields are empty
    if (Object.values(fieldsToValidate).some((field) => field === "")) {
      alert("Please fill all fields");
      return;
    }
  
    // Set submitting state to true to disable the button and show the "Assigning..." text
    setIsSubmitting(true);
  
    try {
      // Submit the data to the server
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRow, assigned: true }),  
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the server response
      const responseData = await response.json();
  
      if (responseData.status === 201) {
        // Optimistically update the UI with the new row
        setRows((prevRows) => [ { ...newRow, assigned: true },...prevRows]);
  
        // Reset the form
        setNewRow({
          name: "",
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
          assigned: false,
        });
  
        alert("Data submitted successfully!");
      } else {
        throw new Error(responseData.error || "Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Failed to submit data: ${error.message}`);
    } finally {
      // Reset the submitting state to allow the button to be used again
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="bg-white">
      <Container fluid className="p-1">
        <div className="border shadow-sm">
          <div className="p-1 border-bottom "  style={{ backgroundImage: "url('/contract.jpg')", 
            width:'100%', height: "8rem", backgroundRepeat:'no-repeat', backgroundPosition: "center" }}>
            <h1 className="m-0 text-white text-center mt-4">
             <LiaFileContractSolid/> Contracts Sign
            </h1>
          </div>
          <div className="table-responsive">
            <Table className="table-bordered mb-0" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {Object.keys(newRow).map((header) => (
                    <th
                    style={{backgroundColor:"#E10174", color:"white"}}
                     className="text-nowrap"
                      key={header}
                      // style={{ fontSize: "11px", padding: "2px" }}
                    >
                      {header.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.keys(newRow).map((field) => (
                    <td key={field} className="text-nowrap" >
                      {field === "assigned" ? (
                        <Button
                          variant="primary"
                          onClick={handleSubmitAndAssign}
                          size="sm"
                          style={{ fontSize: "11px"   }}
                          disabled={isSubmitting}
                          className="px-3"
                        >
                          {isSubmitting ? "Assigning..." : "Assign"}
                        </Button>
                      ) : (
                        <input
                          type={["date_of_joining", "contract_sent_date", "contract_signed_on"].includes(field) ? "date" : "text"}
                          name={field}
                          value={newRow[field]}
                          onChange={handleInputChange}
                          className="form-control form-control-sm"
                          style={{ fontSize: "11px" }}
                          disabled={isSubmitting}
                        />
                      )}
                    </td>
                  ))}
                </tr>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(newRow).map((field) => (
                      <td key={field}  className="text-nowrap">
                        {field === "assigned" ? (
                          <Button
                            variant="success"
                            size="sm"
                            disabled
                            style={{ fontSize: "11px" }}
                          >
                           Assigned
                          </Button>
                        ) : (
                          row[field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Contract;