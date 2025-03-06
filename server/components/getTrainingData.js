import db from "../dbConnection/db.js";

const getTrainingData = async (req, res) => {
    const query = `
        SELECT 
            c.first_name, 
            c.last_name, 
            c.phone, 
            c.market, 
            c.date_of_joining, 
            c.mainstore, 
            nc.ntid, 
            nc.t_mobile_email, 
            ns.ntid_setup_date,
            ts.training_status,
            ts.training_completed_date
        FROM 
            contract c
        INNER JOIN 
            ntid_setup ns ON c.phone = ns.phone
        LEFT JOIN 
            ntid_creation nc ON c.phone = nc.phone
        LEFT JOIN 
            training_status ts ON c.phone = ts.phone
            where ns.ntid_setup_assigned=1
        ORDER BY 
            ns.createdat DESC ;
    `;

    try {
        const [rows] = await db.execute(query); // Execute the query
        res.status(200).json(rows); // Send only the rows
        console.log(rows);
    } catch (error) {
        console.error("Error fetching training data:", error);
        res.status(500).json({ error: "An error occurred while fetching training data" });
    }
};

export default getTrainingData;
