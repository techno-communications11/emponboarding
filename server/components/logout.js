// components/logout.js
export default function logout(req, res) {
  try {
    console.log("Logging out, token was:", req.cookies.token); // Debug token presence
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Failed to log out" });
  }
}