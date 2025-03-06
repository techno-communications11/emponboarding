
import db from "../dbConnection/db.js";
 const getNtidContract = async (req, res) => {
    const query = `
      SELECT 
        * from contract
      where assigned=1
      ORDER BY createdat DESC
    `;
    
    try {
      const [result] = await db.execute(query);  // Assuming db.execute() returns an array with results as the first item
      console.log(result);
      res.status(200).json(result);  // Send result as the response
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Failed to fetch contracts' });  // Send error response if query fails
    }
     };
     export default getNtidContract;