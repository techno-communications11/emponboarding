import db from "../dbConnection/db.js";

// Save Contract
export const saveContract = async (req, res) => {
  const {
    first_name,last_name, phone, email, market, date_of_joining, mainstore,
    stores_to_be_assigned, contract, contract_sent_date,
    contract_sent_to, contract_sent_by, contract_signed_on,
    backout_status, assigned
  } = req.body;
   console.log(req.body);

  // Basic input validation
  if (!first_name) {
    return res.status(400).json({ error: "first_name is required" });
  }

  const query = `
    INSERT INTO contract 
    (first_name,last_name, phone, email, market, date_of_joining, mainstore, stores_to_be_assigned, contract, 
    contract_sent_date, contract_sent_to, contract_sent_by, contract_signed_on, backout_status, assigned)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
    first_name || null,
    last_name|| null, 
    phone || null,
    email || null,
    market || null,
    date_of_joining || null,
    mainstore || null,
    stores_to_be_assigned || null,
    contract || null,
    contract_sent_date || null,
    contract_sent_to || null,
    contract_sent_by || null,
    contract_signed_on || null,
    backout_status || null,
    assigned || false,
  ];

  try {
    const [result] = await db.execute(query, values);
    res.status(201).json({ 
      status: 201, 
      message: "Contract saved successfully", 
      id: result.insertId 
    });
  } catch (err) {
    console.error("Error saving data:", err.message);
    res.status(500).json({ error: "Failed to save data", details: err.message });
  }
};

// Update Contract
export const updateContract = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
   console.log(updates);

  if (!id) {
    return res.status(400).json({ error: "Contract ID is required" });
  }

  const fetchQuery = `SELECT * FROM contract WHERE id = ?`;
  try {
    const [rows] = await db.execute(fetchQuery, [id]);
    if (!rows.length) {
      return res.status(404).json({ error: "Contract not found" });
    }

    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    // Process all fields from the update request
    Object.keys(updates).forEach((key) => {
      // Skip id field if it was accidentally included
      if (key === 'id') return;
      
      // Include field even if it's null or empty string
      fieldsToUpdate.push(`${key} = ?`);
      valuesToUpdate.push(updates[key] === undefined ? null : updates[key]);
    });

    if (!fieldsToUpdate.length) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updateQuery = `
      UPDATE contract
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = ?
    `;

    valuesToUpdate.push(id);

    const [result] = await db.execute(updateQuery, valuesToUpdate);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contract not found or no changes applied" });
    }
    
    res.status(200).json({ 
      status: 200, 
      message: "Contract updated successfully", 
      affectedRows: result.affectedRows 
    });
  } catch (err) {
    console.error("Error updating contract:", err.message);
    res.status(500).json({ error: "Failed to update contract", details: err.message });
  }
};

// Assign Contract
export const assignContract = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  // Fetch existing contract
  const fetchQuery = `SELECT * FROM contract WHERE id = ?`;
  let existingContract;
  try {
    const [rows] = await db.execute(fetchQuery, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }
    existingContract = rows[0];
  } catch (err) {
    console.error("Error fetching contract:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch contract", details: err.message });
  }

  // Validate all fields are filled
  const fieldsToValidate = { ...existingContract };
  delete fieldsToValidate.assigned;

  if (Object.values(fieldsToValidate).some((field) => field === null || field === "")) {
    return res.status(400).json({ error: "All fields must be filled before assigning" });
  }

  // Mark as assigned
  const assignQuery = `
    UPDATE contract
    SET assigned = true
    WHERE id = ?
  `;

  try {
    await db.execute(assignQuery, [id]);
    res.status(200).json({ status: 200, message: "Contract assigned successfully" });
  } catch (err) {
    console.error("Error assigning data:", err.message);
    res.status(500).json({ error: "Failed to assign data", details: err.message });
  }
};