import db from "../dbConnection/db.js";

const deleteTask = async (req, res) => {
    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ message: "Task ID is required" });
    }

    try {
        const query = "DELETE FROM taskassignments WHERE task_id = ?";
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default deleteTask;
