import db from "../dbConnection/db.js";

const getntidsetup = async (req, res) => {
  try {
    const query = `SELECT 
    c.name, 
    c.phone, 
    c.market, 
    c.date_of_joining, 
    c.mainstore, 
    nc.temp_password, 
    nc.ntid, 
    nc.t_mobile_email, 
    ns.yubikey_status, 
    ns.ntid_setup_status, 
    ns.ntid_setup_date, 
    ns.idv_status, 
    ns.idv_docu, 
    ns.yubikey_pin, 
    ns.rtpos_pin, 
    ns.comments
FROM 
    contract c
INNER JOIN 
    ntid_creation nc ON c.phone = nc.phone
LEFT JOIN 
    ntid_setup ns ON c.phone = ns.phone`;
    const [rows] = await db.execute(query); // Destructure to get rows from the result

    if (rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
//  console.log(rows)
    // If there is data, send it back as a response
    res
      .status(200)
      .json({ message: "Data fetched successfully", result: rows });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
};

export default getntidsetup;
