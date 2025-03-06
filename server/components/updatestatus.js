import db from "../dbConnection/db.js";

const updatestatus = async (req, res) => {
  const { id } = req.params; // Extract `id` from URL parameters
  const { status } = req.body; // Extract `status` from request body

  // Validate input
  if (!id || !status) {
    return res.status(400).json({ message: "Invalid or missing data" });
  }

  try {
    // SQL query to update the status of a specific ticket
    const query = `UPDATE tickets SET status = ? WHERE ticket_id = ?`;
    const [result] = await db.execute(query, [status, id]); // Execute the query

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Send success response
    res.status(200).json({ message: "Ticket status updated successfully", result });
  } catch (err) {
    console.error("Error updating ticket status:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export default updatestatus;