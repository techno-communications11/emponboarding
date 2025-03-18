import db from "../dbConnection/db.js";
import bcrypt from "bcrypt";

const updatepassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if the user exists
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Password reset failed. Please try again." });
  }
};

export default updatepassword;