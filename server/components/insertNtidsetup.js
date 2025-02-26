import db from "../dbConnection/db.js";

const insertNtidsetup = async (req, res) => {
  const { phone, ntid, yubiKeyStatus, ntidSetupStatus, ntidSetupDate, idvStatus, idvDocu, yubiKeyPin, rtposPin, comments,id } = req.body;
  console.log(req.body, "data");

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    // Query to check if the phone already exists in the database
    const getquery = 'SELECT phone FROM ntid_setup WHERE phone = ?';
    const [rows] = await db.execute(getquery, [phone]);

    if (rows.length > 0) {
      // If phone exists, respond with an error
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // If phone doesn't exist, proceed with insertion
    const query = `
      INSERT INTO ntid_setup (phone, ntid, yubikey_status, ntid_setup_status, ntid_setup_date, idv_status, idv_docu, yubikey_pin, rtpos_pin, comments,last_edited_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const values = [phone, ntid, yubiKeyStatus, ntidSetupStatus, ntidSetupDate, idvStatus, idvDocu, yubiKeyPin, rtposPin, comments,id];

    await db.execute(query, values);
    
    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Failed to insert data" });
  }
};

export default insertNtidsetup;
