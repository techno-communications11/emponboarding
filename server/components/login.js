// components/login.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../dbConnection/db.js';

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    return res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'An error occurred during login.' });
  }
}

export default login;