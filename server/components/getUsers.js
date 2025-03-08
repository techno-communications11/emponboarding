import db from "../dbConnection/db.js";

const getUsers = async (req, res) => {
  try {
    const query = `
   SELECT DISTINCT 
    sh.employee_name AS name,
    sh.employee_id AS id
FROM 
    users u
INNER JOIN 
    employeeschedule sh 
ON 
    u.technoid = sh.employee_id;
`;
    const [result] = await db.execute(query);
    console.log(result);
    res.status(200).json({
      message: "Data fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "Unable to fetch users",
      error: err.message,
    });
  }
};

export default getUsers;
