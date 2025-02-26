import db from "../dbConnection/db.js";

const getContract = async (req, res) => {
  const query = `
    SELECT 
      c.name,
      c.email,
      c.phone,
      c.market,
      c.mainstore,
      c.date_of_joining,
      c.stores_to_be_assigned,
      c.contract,
      c.contract_sent_date,
       c.contract_sent_to,
        c.contract_sent_by,
         c.contract_signed_on,
          c.backout_status,
          c.assigned,
      nc.ntid,
      nc.ntid_created_on,
      nc.t_mobile_email,
      nc.temp_password
    FROM contract c
    LEFT JOIN ntid_creation nc ON c.phone = nc.phone
    WHERE c.assigned = true
    ORDER BY c.createdat DESC
  `;
  
  try {
    const [result] = await db.execute(query);  // Assuming db.execute() returns an array with results as the first item
    res.status(200).json(result);  // Send result as the response
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });  // Send error response if query fails
  }
};

export default getContract;
