import db from "../dbConnection/db.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TaskDataUpload = async (req, res) => {
  const { userid, taskdata } = req.body;

  console.log(req.body);

  try {
    // Validation check
    if (!userid || !taskdata) {
      return res
        .status(400)
        .json({ message: "User ID and task data are required" });
    }

    const query = `INSERT INTO tasks (userid, taskdata) VALUES (?, ?)`;
    const values = [userid, taskdata];

    // Execute query and get result
    const [result] = await db.execute(query, values);

    // Fetch all admin emails
    const [emailresultdata] = await db.execute(
      `SELECT email FROM users WHERE department='admin'`
    );

    if (emailresultdata.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No admin users found",
      });
    }

    // Fetch user email
    const [emailresult] = await db.execute(
      `SELECT email FROM users WHERE id=?`,
      [userid]
    );

    if (emailresult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user found for the provided ID",
      });
    }

    const userEmail = emailresult[0].email;
    const adminEmails = emailresultdata.map((user) => user.email); // Extract emails

    const createdAt = new Date().toLocaleString(); // Get current timestamp

    // Construct email body
    let emailBody = `
      <h1 style="font-family: Arial, sans-serif; color: #333;">Task Update</h1>
      <p>Dear Admin,</p>
      <p>User <strong>${userEmail}</strong> has submitted the following task:</p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px;">
        ${taskdata}
      </blockquote>
      <p>Submitted on: ${createdAt}</p>
      <p>Thank you.</p>
      <p>Best regards,</p>
      <p>Your Team</p>
      <a href="https://internal.techno-communications.com/" style="padding:10px 20px;background-color:#007BFF;color:white;border-radius:5px;text-decoration:none;">View Details</a>
    `;

    // Send the email using Resend API
    await resend.emails.send({
      from: "ticketing@techno-communications.com", // Use a valid sender email
      to: adminEmails, // Send email to all admins
      subject: "Daily Work Update",
      html: emailBody,
    });

    // Return success response
    res.status(201).json({
      message: "Task data inserted successfully and email sent",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting task data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default TaskDataUpload;
