import db from "../dbConnection/db.js";

const getTask = async (req, res) => {
    const query = `SELECT t.*, u.email 
        FROM tasks t
        LEFT JOIN users u ON u.id = t.userid
        ORDER BY t.createdat DESC`;

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

export default getTask;
