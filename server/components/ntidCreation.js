import db from "../dbConnection/db.js";

// Insert or Update NTID Data (Incremental Insert/Update)
const ntidcreation = async (req, res) => {
  const { ntid, t_mobile_email, temp_password, phone, ntid_created_on, id } = req.body;
  console.log("Request Body for Insert/Update:", req.body);

  if (!phone || !id) {
    return res.status(400).json({ error: "Phone and ID are required." });
  }

  // Check if a record already exists for this phone
  const checkQuery = `SELECT phone FROM ntid_creation WHERE phone = ?`;
  const [existing] = await db.execute(checkQuery, [phone]);

  if (existing.length === 0) {
    // Insert new record if it doesn’t exist
    const insertQuery = `
      INSERT INTO ntid_creation
      (ntid, t_mobile_email, temp_password, ntid_created_on, phone, last_edited_id, assignedntid)
      VALUES (?, ?, ?, ?, ?, ?, FALSE);
    `;
    const values = [
      ntid || null,
      t_mobile_email || null,
      temp_password || null,
      ntid_created_on || null,
      phone,
      id,
    ];

    try {
      const [result] = await db.execute(insertQuery, values);
      if (result.insertId) {
        return res.status(201).json({ status: 201, message: "NTID record created successfully" });
      } else {
        return res.status(500).json({ error: "Failed to create NTID record" });
      }
    } catch (err) {
      console.error("Error inserting NTID:", err);
      return res.status(500).json({ error: "Failed to create NTID record", details: err.message });
    }
  } else {
    // Update existing record if it exists
    const fieldsToUpdate = [];
    const values = [];

    if (ntid !== undefined) {
      fieldsToUpdate.push("ntid = ?");
      values.push(ntid);
    }
    if (t_mobile_email !== undefined) {
      fieldsToUpdate.push("t_mobile_email = ?");
      values.push(t_mobile_email);
    }
    if (temp_password !== undefined) {
      fieldsToUpdate.push("temp_password = ?");
      values.push(temp_password);
    }
    if (ntid_created_on !== undefined) {
      fieldsToUpdate.push("ntid_created_on = ?");
      values.push(ntid_created_on);
    }
    if (id !== undefined) {
      fieldsToUpdate.push("last_edited_id = ?");
      values.push(id);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No fields provided to update." });
    }

    const updateQuery = `
      UPDATE ntid_creation
      SET ${fieldsToUpdate.join(", ")}
      WHERE phone = ? AND assignedntid = FALSE;
    `;
    values.push(phone);

    try {
      const [result] = await db.execute(updateQuery, values);
      if (result.affectedRows > 0) {
        return res.status(200).json({ status: 200, message: "NTID updated successfully" });
      } else {
        return res.status(404).json({ error: "No unassigned NTID record found for the provided phone number or already assigned." });
      }
    } catch (err) {
      console.error("Error updating NTID:", err);
      return res.status(500).json({ error: "Failed to update NTID", details: err.message });
    }
  }
};

// Assign NTID (Toggle assigned to TRUE)
const assignNtid = async (req, res) => {
  const { phone, id } = req.body;
  console.log("Request Body for Assign:", req.body);

  if (!phone || !id) {
    return res.status(400).json({ error: "Phone and ID are required." });
  }

  // Check if all required fields are filled
  const checkQuery = `
    SELECT ntid, t_mobile_email, temp_password, ntid_created_on 
    FROM ntid_creation 
    WHERE phone = ? AND assignedntid = FALSE;
  `;
  const [rows] = await db.execute(checkQuery, [phone]);

  if (rows.length === 0) {
    return res.status(404).json({ error: "No unassigned NTID record found for the provided phone number." });
  }

  const row = rows[0];
  if (!row.ntid || !row.t_mobile_email || !row.temp_password || !row.ntid_created_on) {
    return res.status(400).json({ error: "All NTID fields (NTID, T Mobile Email, Temp Password, NTID Created On) must be filled before assignment." });
  }

  // Update assigned status to TRUE
  const assignQuery = `
    UPDATE ntid_creation
    SET assignedntid = TRUE, last_edited_id = ?
    WHERE phone = ? AND assignedntid = FALSE;
  `;
  const values = [id, phone];

  try {
    const [result] = await db.execute(assignQuery, values);
    if (result.affectedRows > 0) {
      return res.status(200).json({ status: 200, message: "NTID assigned successfully" });
    } else {
      return res.status(500).json({ error: "Failed to assign NTID" });
    }
  } catch (err) {
    console.error("Error assigning NTID:", err);
    return res.status(500).json({ error: "Failed to assign NTID", details: err.message });
  }
};

export { ntidcreation, assignNtid };