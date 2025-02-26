import db from "../dbConnection/db.js";

const ntidcreation = async (req, res) => {
  const { ntid, t_mobile_email, temp_password, phone, ntid_created_on, id } = req.body;
  console.log("Request Body:", req.body);

  // Check if required fields are provided
  if (!ntid || !t_mobile_email || !temp_password || !phone || !ntid_created_on || !id) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // SQL query to insert NTID-related data
  const query = `
    INSERT INTO ntid_creation
    (ntid, t_mobile_email, temp_password, ntid_created_on, phone, last_edited_id)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const values = [ntid, t_mobile_email, temp_password, ntid_created_on, phone, id];

  // Use try-catch to handle async database query with execute
  try {
    const [result] = await db.execute(query, values);  // db.execute returns a promise

    // Check if the insertion was successful
    if (result.insertId) {
      return res.status(201).json({ status: 201, message: "NTID assigned successfully" });
    } else {
      return res.status(500).json({ error: "Failed to assign NTID" });
    }
  } catch (err) {
    console.error("Error inserting NTID:", err);
    return res.status(500).json({ error: "Failed to assign NTID" });
  }
};

export default ntidcreation;
