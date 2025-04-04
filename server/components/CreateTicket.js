import db from "../dbConnection/db.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Create Ticket Endpoint
const createTicket = async (req, res) => {
  const { employee_id, name, title, description, priority } = req.body;

  // Validation
  if (!employee_id || !name || !title || !description || !priority) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Insert Ticket
    const query = `
      INSERT INTO tickets (employee_id, name, title, description, priority)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [employee_id, name, title, description, priority];

    const [result] = await db.execute(query, values);

    // Fetch Admin Emails
    const emailQuery = `SELECT email FROM users WHERE department = 'admin'`;
    const [admins] = await db.execute(emailQuery);
    
    if (!admins.length) {
      console.warn("No admin emails found.");
      return res.status(201).json({
        result,
        message: "Ticket created successfully, but no admin emails found.",
      });
    }

    const adminEmails = admins.map((admin) => admin.email);

    // Send Email Notification
    const emailBody = `
      <h1>New Ticket Created</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p>Please review this ticket.</p>
      <a href="https://internal.techno-communications.com/" style="padding:10px 20px;background-color:#007BFF;color:white;border-radius:5px;text-decoration:none;">View Details</a>
    `;

    await resend.emails.send({
      from: "ticketing@techno-communications.com",
      to: adminEmails, // Sending email to multiple admins
      subject: `New Ticket Created: ${title}`,
      html: emailBody,
    });

    res.status(201).json({
      result,
      message: "Ticket created successfully and email sent to admins.",
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default createTicket;
