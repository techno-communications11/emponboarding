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
  console.log("Request Body for Assign:", req.body);

  if (!phone || !ntid || !id) {
    return res.status(400).json({ error: "Phone, NTID, and ID are required." });
  }

  try {
    const checkQuery = `
      SELECT yubikey_status, ntid_setup_status, ntid_setup_date, idv_status, idv_docu, yubikey_pin, rtpos_pin, comments, megentau
      FROM ntid_setup 
      WHERE phone = ? AND ntid = ? AND ntid_setup_assigned = 0;
    `;
    const [rows] = await db.execute(checkQuery, [phone, ntid]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No unassigned NTID setup record found for the provided phone and NTID." });
    }

    const row = rows[0];
    if (!row.yubikey_status || !row.ntid_setup_status || !row.ntid_setup_date || 
        !row.idv_status || !row.idv_docu || !row.yubikey_pin || !row.rtpos_pin || 
        !row.comments || row.megentau === null || row.megentau === undefined) { // Added megentau check
      return res.status(400).json({ error: "All NTID setup fields, including megentau, must be filled before assignment." });
    }

    const assignQuery = `
      UPDATE ntid_setup
      SET ntid_setup_assigned = 1, last_edited_id = ?
      WHERE phone = ? AND ntid = ? AND ntid_setup_assigned = 0;
    `;
    const values = [id, phone, ntid];

    const [result] = await db.execute(assignQuery, values);

    if (result.affectedRows > 0) {
      // Fetch NTID Setup Team Emails
      const emailQuery = `SELECT email FROM users WHERE department = 'Training Team'`;
      const [emailRows] = await db.execute(emailQuery);
      const teamEmails = emailRows.map(user => user.email);
      console.log("Team Emails:", teamEmails);

      if (teamEmails.length > 0) {
        try {
          await resend.emails.send({
            from: "ticketing@techno-communications.com",
            to: teamEmails,
            subject: "NTID Setup Assigned",
            html: `
              <p>Hello NTID Setup Team,</p>
              <p>A new NTID setup has been assigned.</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>NTID:</strong> ${ntid}</p>
              <p>Please review and complete the process.</p>
              <p>Best Regards,</p>
              <p>Your Company</p>
            `,
          });
          console.log("Email sent successfully.");
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          return res.status(500).json({ error: "Failed to send email", details: emailError.message });
        }
      } else {
        console.warn("No NTID Setup Team emails found.");
      }

      return res.status(200).json({ status: 200, message: "NTID setup assigned successfully" });
    } else {
      return res.status(500).json({ error: "Failed to assign NTID setup" });
    }

  } catch (error) {
    console.error("Error assigning NTID setup:", error);
    return res.status(500).json({ error: "Failed to assign NTID setup", details: error.message });
  } 
};

export { insertNtidSetup, assignNtidSetup };