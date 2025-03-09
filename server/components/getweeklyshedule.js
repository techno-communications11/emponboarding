import db from "../dbConnection/db.js";

const getweekshedule = async (req, res) => {
    try {
        const { userid } = req.params;

        if (!userid) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }

        // Query to get technoid and department from users table
        const getTechnoIdQuery = "SELECT technoid, department FROM users WHERE id = ?";
        const [resultId] = await db.execute(getTechnoIdQuery, [userid]);

        if (resultId.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { technoid, department } = resultId[0];

        let scheduleResult;

        // If department is "Admin", fetch all data
        if (department === "Admin") {
            const getAllScheduleQuery = "SELECT * FROM employeeschedule ";
            [scheduleResult] = await db.execute(getAllScheduleQuery);
        } else {
            // Fetch data for the specific user
            const getWeeklyScheduleQuery = "SELECT * FROM employeeschedule WHERE employee_id = ?";
            [scheduleResult] = await db.execute(getWeeklyScheduleQuery, [technoid]);
        }

        console.log(scheduleResult);
        return res.status(200).json(scheduleResult);
    } catch (error) {
        console.error("Error fetching weekly schedule:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getweekshedule;