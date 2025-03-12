import db from "../dbConnection/db.js";

const   getTaskData = async (req, res) => {
  try {
    // Query to fetch task data with employee names
    const query = `
      SELECT 
    t.user_id, 
    t.task_id,
    c.description, 
    c.priority, 
    c.due_date, 
    c.created_at,
    u.username
FROM 
    TaskAssignments t 
LEFT JOIN 
    taskcreationtable c 
    ON t.task_id = c.id
LEFT JOIN 
    users u 
    ON t.user_id = u.id
LEFT JOIN 
    (SELECT employee_id FROM employeeschedule GROUP BY employee_id) sh 
    ON u.technoid = sh.employee_id
ORDER BY 
    c.created_at DESC;

    `;

    // Execute the query
    const [result] = await db.execute(query);
     console.log(result);

    // Send the result as a response
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching task data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch task data" });
  }
};

export default getTaskData;