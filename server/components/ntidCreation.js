import db from "../dbConnection/db.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Insert or Update NTID Data (Incremental Insert/Update)
const ntidcreation = async (req, res) => {
  try {
    const { ntid, t_mobile_email, temp_password, phone, ntid_created_on, id } = req.body;
    console.log("Request Body for Insert/Update:", req.body);

    if (!phone || !id) {
      return res.status(400).json({ error: "Phone and ID are required." });
    }

    // Check if a record already exists for this phone
    const checkQuery = `SELECT phone FROM ntid_creation WHERE phone = ?`;
    const [existing] = await db.execute(checkQuery, [phone]);

    if (existing.length === 0) {
      // Insert new record if it doesn't exist
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

      const [result] = await db.execute(insertQuery, values);
      if (result.insertId) {
        return res.status(201).json({ 
          status: 201, 
          message: "NTID record created successfully",
          data: { id: result.insertId }
        });
      }
      return res.status(500).json({ error: "Failed to create NTID record" });
    } else {
      // Update existing record
      const fieldsToUpdate = [];
      const values = [];

      if (ntid !== undefined) fieldsToUpdate.push("ntid = ?"), values.push(ntid);
      if (t_mobile_email !== undefined) fieldsToUpdate.push("t_mobile_email = ?"), values.push(t_mobile_email);
      if (temp_password !== undefined) fieldsToUpdate.push("temp_password = ?"), values.push(temp_password);
      if (ntid_created_on !== undefined) fieldsToUpdate.push("ntid_created_on = ?"), values.push(ntid_created_on);
      fieldsToUpdate.push("last_edited_id = ?"), values.push(id);

      if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: "No fields provided to update." });
      }

      const updateQuery = `
        UPDATE ntid_creation
        SET ${fieldsToUpdate.join(", ")}
        WHERE phone = ? AND assignedntid = FALSE;
      `;
      values.push(phone);

      const [result] = await db.execute(updateQuery, values);
      if (result.affectedRows > 0) {
        return res.status(200).json({ 
          status: 200, 
          message: "NTID updated successfully",
          data: { affectedRows: result.affectedRows }
        });
      }
      return res.status(404).json({ 
        error: "No unassigned NTID record found for the provided phone number or already assigned." 
      });
    }
  } catch (err) {
    console.error("Error in ntidcreation:", err);
    return res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
  }
};

// Assign NTID (Toggle assigned to TRUE)
const assignNtid = async (req, res) => {
  try {
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
      return res.status(400).json({ 
        error: "All NTID fields (NTID, T Mobile Email, Temp Password, NTID Created On) must be filled before assignment." 
      });
    }

    // Get setup team emails
    const emailQuery = `SELECT email FROM users WHERE department = 'Ntid Setup team'`;
    const [emailRows] = await db.execute(emailQuery);
    
    if (emailRows.length === 0) {
      console.warn("No email found for NTID setup team. Continuing without email notification.");
    } else {
      const userEmails = emailRows.map((row) => row.email);
      const emailBody = `
        <h1>NTID Assignment Notification</h1>
        <p>Dear NTID Setup Team,</p>
        <p>The following NTID has been assigned:</p>
        <ul>
          <li>NTID: ${row.ntid}</li>
          <li>T Mobile Email: ${row.t_mobile_email}</li>
          <li>Temp Password: ${row.temp_password}</li>
          <li>NTID Created On: ${row.ntid_created_on}</li>
        </ul>
        <p>Please take the necessary actions.</p>
        <p>Best regards,</p>
        <p>Your System</p>
      `;
      const emailSubject = `NTID Assignment Notification for ${row.ntid}`;

      try {
        await resend.emails.send({
          from: "ticketing@techno-communications.com",
          to: userEmails,
          subject: emailSubject,
          html: emailBody,
        });
        console.log(`Email sent successfully to ${userEmails.join(", ")}`);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the whole operation if email fails
      }
    }

    // Update assigned status to TRUE
    const assignQuery = `
      UPDATE ntid_creation
      SET assignedntid = TRUE, last_edited_id = ?
      WHERE phone = ? AND assignedntid = FALSE;
    `;
    const [result] = await db.execute(assignQuery, [id, phone]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ 
        status: 200, 
        message: "NTID assigned successfully",
        data: { affectedRows: result.affectedRows }
      });
    }
    return res.status(500).json({ error: "Failed to assign NTID" });
  } catch (err) {
    console.error("Error in assignNtid:", err);
    return res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
  }
};

export { ntidcreation, assignNtid };