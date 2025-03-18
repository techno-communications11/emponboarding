


// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  console.log(token, "token"); // Debug: Logs undefined if no token

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
}