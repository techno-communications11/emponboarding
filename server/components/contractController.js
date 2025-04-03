import db from "../dbConnection/db.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to sanitize phone numbers
const sanitizePhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let sanitized = phone.replace(/\D/g, '');
  
  // Remove country code if present (assuming US numbers for this example)
  // Adjust this based on your requirements
  if (sanitized.length > 10) {
    sanitized = sanitized.slice(-10); // Keep last 10 digits
  }
  
  return sanitized || null;
};

// Save Contract
export const saveContract = async (req, res) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    market,
    date_of_joining,
    mainstore,
    stores_to_be_assigned,
    contract,
    contract_sent_date,
    contract_sent_to,
    contract_sent_by,
    contract_signed_on,
    backout_status,
    address,
    assigned,
  } = req.body;

  // Basic input validation
  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name and last_name are required" });
  }

  // Sanitize phone number
  const sanitizedPhone = sanitizePhoneNumber(phone);

  const query = `
    INSERT INTO contract 
    (first_name, last_name, phone, email, market, date_of_joining, mainstore, stores_to_be_assigned, contract, 
    contract_sent_date, contract_sent_to, contract_sent_by, contract_signed_on, backout_status, address, assigned)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    first_name || null,
    last_name || null,
    sanitizedPhone, // Use sanitized phone number
    email || null,
    market || null,
    date_of_joining || null,
    mainstore || null,
    stores_to_be_assigned || null,
    contract || false,
    contract_sent_date || null,
    contract_sent_to || null,
    contract_sent_by || null,
    contract_signed_on || null,
    backout_status || false,
    address || false,
    assigned || false,
  ];

  try {
    const [result] = await db.execute(query, values);
    res.status(201).json({
      status: 201,
      message: "Contract saved successfully",
      id: result.insertId,
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

  if (!id) {
    return res.status(400).json({ error: "Contract ID is required" });
  }

  // Sanitize phone number if it's being updated
  if (updates.phone) {
    updates.phone = sanitizePhoneNumber(updates.phone);
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
      if (key === "id") return;
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
      affectedRows: result.affectedRows,
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

  // Define mandatory fields based on contract value
  const baseFields = [
    "first_name",
    "last_name",
    "phone",
    "email",
    "market",
    "date_of_joining",
    "mainstore",
    "stores_to_be_assigned",
    "contract",
  ];

  const contractFields = [
    "contract_sent_date",
    "contract_sent_to",
    "contract_sent_by",
    "contract_signed_on",
  ];

  // Check base fields
  const missingBaseFields = baseFields.filter(
    (field) =>
      existingContract[field] === null ||
      existingContract[field] === "" ||
      existingContract[field] === undefined
  );

  if (missingBaseFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingBaseFields.join(", ")}`,
    });
  }

  // If contract is true, check additional contract fields
  if (existingContract.contract === true) {
    const missingContractFields = contractFields.filter(
      (field) =>
        existingContract[field] === null ||
        existingContract[field] === "" ||
        existingContract[field] === undefined
    );

    if (missingContractFields.length > 0) {
      return res.status(400).json({
        error: `When contract is Yes, these fields are required: ${missingContractFields.join(
          ", "
        )}`,
      });
    }
  }
  const emailQuery = `SELECT email FROM users WHERE department = 'NTID Creation Team'`;

  try {
    const [users] = await db.execute(emailQuery);
    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found in the NTID Creation Team" });
    }

    // Extract email addresses
    const userEmails = users.map((user) => user.email);

    const createdAt = new Date().toLocaleString();

    let emailBody = `
      <h1 style="font-family: Arial, sans-serif; color: #333;">Ntid Creation Assigned</h1>
      <p>Dear User,</p>
      <p>Contract sent/assigned to NTID Creation Team</p>
      <p>Contract Details:</p>
      <p>First Name: ${existingContract.first_name}</p>
      <p>Last Name: ${existingContract.last_name}</p>
      <p>For the contract assigned on ${createdAt}</p>
      <p>Thank you for your cooperation.</p>
      <p>Best regards,</p>
      <p>Your Team</p>
      <a href="https://yourapp.com" style="padding:10px 20px;background-color:#007BFF;color:white;border-radius:5px;text-decoration:none;">View Details</a>
    `;

    // Send emails to all recipients
    await Promise.all(
      userEmails.map((email) =>
        resend.emails.send({
          from: "ticketing@techno-communications.com",
          to: email,
          subject: `Contract assigned to Team NTID Creation`,
          html: emailBody,
        })
      )
    );

    console.log(`Email sent successfully to ${userEmails.join(", ")}`);

    // Update contract as assigned
    const assignQuery = `UPDATE contract SET assigned = true WHERE id = ?`;
    await db.execute(assignQuery, [id]);

    res
      .status(200)
      .json({
        status: 200,
        message: "Contract assigned successfully and emails sent",
      });
  } catch (err) {
    console.error("Error assigning contract:", err.message);
    res
      .status(500)
      .json({ error: "Failed to assign contract", details: err.message });
  }
};
