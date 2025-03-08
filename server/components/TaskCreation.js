import db from "../dbConnection/db.js";

const assignTask = async (req, res) => {
  const { taskDescription, userIds, priority, dueDate } = req.body;
  console.log("Request Body:", req.body);

  // Validate input
  if (!taskDescription || !userIds || !Array.isArray(userIds) || userIds.length === 0 || !priority || !dueDate) {
    return res.status(400).json({ error: "All fields are required, and userIds must be a non-empty array" });
  }

  try {
    // 1️⃣ Insert task into taskcreation table
    const [taskResult] = await db.execute(
      "INSERT INTO taskcreationtable (description, priority, due_date, created_at) VALUES (?, ?, ?, NOW())",
      [taskDescription, priority, dueDate]
    );

    // Verify taskId
    const taskId = taskResult.insertId;
    if (!taskId || typeof taskId !== "number") {
      throw new Error("Failed to retrieve a valid task ID from taskcreation table");
    }

    console.log("Task created with ID:", taskId);

    // 2️⃣ Map userIds (e.g., 'Tech0006') to their corresponding user_id (e.g., 6)
    const mappedUserIds = await Promise.all(
      userIds.map(async (userId) => {
        // Fetch the user_id from the users table based on the userId (e.g., 'Tech0006')
        const [user] = await db.execute(
          "SELECT id FROM users WHERE technoid = ?",
          [userId]
        );

        if (!user || user.length === 0) {
          throw new Error(`User with ID ${userId} not found`);
        }

        return user[0].id; // Return the integer user_id
      })
    );

    console.log("Mapped User IDs:", mappedUserIds);

    // 3️⃣ Assign the task to multiple users in taskassignments table
    const assignmentValues = mappedUserIds.map(userId => [taskId, userId]);

    console.log("Assignment Values:", assignmentValues);

    // Construct the query for bulk insertion
    const assignmentQuery = `
      INSERT INTO taskassignments (task_id, user_id) 
      VALUES ${assignmentValues.map(() => "(?, ?)").join(", ")}
    `;

    // Flatten the assignmentValues array for the query
    const flattenedValues = assignmentValues.flat();

    console.log("Flattened Values:", flattenedValues);

    // Execute the bulk insertion query
    await db.execute(assignmentQuery, flattenedValues);

    res.status(201).json({ message: "Task assigned successfully", taskId });

  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Task assignment failed", details: error.message });
  }
};

export default assignTask;