import db from "../dbConnection/db.js";

const ViewTicket = async (req, res) => {
    const query = `SELECT t.*, u.email 
        FROM tickets t
        LEFT JOIN users u ON u.id = t.employee_id
        ORDER BY t.created_at DESC`;

    try {
        const [rows] = await db.execute(query); // Execute the query
        ;

        res.status(200).json(rows); // Send only the rows
        console.log(rows);
    } catch (error) {
        console.error("Error fetching training data:", error);
        res.status(500).json({ error: "An error occurred while fetching training data" });
    }
};

export default ViewTicket;
