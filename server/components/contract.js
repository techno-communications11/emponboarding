import db from "../dbConnection/db.js";

// Wrapper function to convert db.query into a Promise


const contract = async (req, res) => {
  console.log("Data received:", req.body); // Log the incoming data

  let {
    name, phone, email, market, date_of_joining, mainstore,
    stores_to_be_assigned, contract, contract_sent_date, 
    contract_sent_to, contract_sent_by, contract_signed_on, 
    backout_status,assigned
  } = req.body;

  if (!name || !phone || !email || !market || !date_of_joining || !mainstore || !contract || !contract_sent_date || !contract_sent_to || !contract_sent_by || !contract_signed_on || !backout_status||!assigned) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
    phone = phone.replace(/[^\d+]/g, '').slice(-10);
//    console.log(phone);

  const query = `
    INSERT INTO contract 
    (name, phone, email, market, date_of_joining, mainstore, stores_to_be_assigned, contract, 
    contract_sent_date, contract_sent_to, contract_sent_by, contract_signed_on, backout_status,assigned)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name, phone, email, market, date_of_joining, mainstore, stores_to_be_assigned, contract,
    contract_sent_date, contract_sent_to, contract_sent_by, contract_signed_on, backout_status, assigned
  ];

  try {
    const result = await db.execute(query, values); // Use the queryPromise function here
    console.log("Contract registered:", result); // Optionally log the result for debugging
    res.status(201).json({ status: 201, message: 'Contract registered successfully' });
  } catch (err) {
    console.error('Error inserting data:', err.message); // Log the specific error
    return res.status(500).json({ error: 'Failed to submit data', details: err.message });
  }
};

export default contract;
