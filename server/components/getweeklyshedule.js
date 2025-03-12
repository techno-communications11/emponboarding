import db from "../dbConnection/db.js";

const getweekshedule = async (req, res) => {
    try {
        const { userid } = req.params;

        if (!userid) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }

        // Query to get technoid, username, and department from users table
        const getUserQuery = "SELECT technoid, username, department FROM users WHERE id = ?";
        const [userResult] = await db.execute(getUserQuery, [userid]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { technoid, department } = userResult[0];

        let scheduleQuery;
        let queryParams = [];

        if (department === "Admin") {
            // Fetch all employee schedules with user details for Admin
            scheduleQuery = `
                SELECT es.*, u.username, u.department 
                FROM employeeschedule es 
                JOIN users u ON es.employee_id = u.technoid
            `;
        } else {
            // Fetch only the specific user's schedule
            scheduleQuery = `
                SELECT es.*, u.username, u.department 
                FROM employeeschedule es 
                JOIN users u ON es.employee_id = u.technoid
                WHERE es.employee_id = ?
            `;
            queryParams = [technoid];
        }

        const [scheduleResult] = await db.execute(scheduleQuery, queryParams);

        console.log(scheduleResult, 'results');
        return res.status(200).json(scheduleResult);
    } catch (error) {
        console.error("Error fetching weekly schedule:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getweekshedule;
