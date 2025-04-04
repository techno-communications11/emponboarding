import db from "../dbConnection/db.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const insertNtidSetup = async (req, res) => {
  const { 
    phone, 
    ntid, 
    yubiKeyStatus, 
    ntidSetupStatus, 
    ntidSetupDate, 
    idvStatus, 
    idvDocu, 
    yubiKeyPin, 
    rtposPin, 
    comments, 
    megentau, // Added megentau
    id 
  } = req.body;
  console.log("Request Body for Insert/Update:", req.body);

  if (!phone || !ntid || !id) {
    return res.status(400).json({ error: "Phone, NTID, and ID are required." });
  }

  try {
    const checkQuery = `SELECT phone, ntid FROM ntid_setup WHERE phone = ? AND ntid = ?`;
    const [existing] = await db.execute(checkQuery, [phone, ntid]);

    if (existing.length === 0) {
      const insertQuery = `
        INSERT INTO ntid_setup
        (phone, ntid, yubikey_status, ntid_setup_status, ntid_setup_date, idv_status, idv_docu, yubikey_pin, rtpos_pin, comments, megentau, last_edited_id, ntid_setup_assigned)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
      `;
      const values = [
        phone,
        ntid,
        yubiKeyStatus === "Yes" ? 1 : 0,
        ntidSetupStatus === "Yes" ? 1 : 0,
        ntidSetupDate || null,
        idvStatus === "Yes" ? 1 : 0,
        idvDocu || null,
        yubiKeyPin || null,
        rtposPin || null,
        comments || null,
        megentau === "Yes" ? 1 : 0, // Added megentau
        id,
      ];

      const [result] = await db.execute(insertQuery, values);
      return res.status(201).json({ status: 201, message: "NTID setup record created successfully" });
    } else {
      const fieldsToUpdate = [];
      const values = [];

      if (yubiKeyStatus !== undefined) { fieldsToUpdate.push("yubikey_status = ?"); values.push(yubiKeyStatus === "Yes" ? 1 : 0); }
      if (ntidSetupStatus !== undefined) { fieldsToUpdate.push("ntid_setup_status = ?"); values.push(ntidSetupStatus === "Yes" ? 1 : 0); }
      if (ntidSetupDate !== undefined) { fieldsToUpdate.push("ntid_setup_date = ?"); values.push(ntidSetupDate); }
      if (idvStatus !== undefined) { fieldsToUpdate.push("idv_status = ?"); values.push(idvStatus === "Yes" ? 1 : 0); }
      if (idvDocu !== undefined) { fieldsToUpdate.push("idv_docu = ?"); values.push(idvDocu); }
      if (yubiKeyPin !== undefined) { fieldsToUpdate.push("yubikey_pin = ?"); values.push(yubiKeyPin); }
      if (rtposPin !== undefined) { fieldsToUpdate.push("rtpos_pin = ?"); values.push(rtposPin); }
      if (comments !== undefined) { fieldsToUpdate.push("comments = ?"); values.push(comments); }
      if (megentau !== undefined) { fieldsToUpdate.push("megentau = ?"); values.push(megentau === "Yes" ? 1 : 0); } // Added megentau
      if (id !== undefined) { fieldsToUpdate.push("last_edited_id = ?"); values.push(id); }

      if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: "No fields provided to update." });
      }

      const updateQuery = `
        UPDATE ntid_setup
        SET ${fieldsToUpdate.join(", ")}
        WHERE phone = ? AND ntid = ? AND ntid_setup_assigned = 0;
      `;
      values.push(phone, ntid);

      const [result] = await db.execute(updateQuery, values);
      return res.status(200).json({ status: 200, message: "NTID setup updated successfully" });
    }
  } catch (error) {
    console.error("Error in NTID setup insert/update:", error);
    return res.status(500).json({ error: "Failed to process NTID setup", details: error.message });
  }
};

// Assign NTID Setup (Toggle ntid_setup_assigned to 1)
const assignNtidSetup = async (req, res) => {
  const { phone, ntid, id } = req.body;
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  if (!phone || !ntid || !id) {
    return res.status(400).json({ 
      error: "Phone, NTID, and ID are required.",
      received: { phone, ntid, id }
    });
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM ntid_setup 
       WHERE phone = ? AND ntid = ? AND ntid_setup_assigned = 0`,
      [phone, ntid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        error: "No unassigned record found for the provided phone/NTID.",
        phone,
        ntid
      });
    }

    const row = rows[0];
    console.log("Database Record:", JSON.stringify(row, null, 2));

    // Check for null/undefined (allows 0, false, empty string)
    const requiredFields = {
      yubikey_status: row.yubikey_status != null,
      ntid_setup_status: row.ntid_setup_status != null, // Allows 0
      ntid_setup_date: row.ntid_setup_date,
      idv_status: row.idv_status != null,
      idv_docu: row.idv_docu,
      yubikey_pin: row.yubikey_pin,
      rtpos_pin: row.rtpos_pin,
      comments: row.comments,
      megentau: row.megentau != null,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, isValid]) => !isValid)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Incomplete NTID setup record.",
        missingFields,
        record: row,
      });
    }

    // Proceed with assignment
    const [result] = await db.execute(
      `UPDATE ntid_setup 
       SET ntid_setup_assigned = 1, last_edited_id = ?
       WHERE phone = ? AND ntid = ?`,
      [id, phone, ntid]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "Assignment failed (no rows updated)." });
    }

    return res.status(200).json({ 
      success: true,
      message: "NTID setup assigned successfully." 
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ 
      error: "Internal server error.",
      details: error.message 
    });
  }
};

export { insertNtidSetup, assignNtidSetup };