 import db from '../dbConnection/db.js'
  import bcrypt from 'bcrypt'

// The Register function
const register = async (req, res) => {
  let { email, password,role,Technoid } = req.body;
  console.log('Incoming request body:', req.body);

  if (!email || !password) {
    // console.error('Missing email or password');
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Check if the user already exists
    const userCheckQuery = 'SELECT * FROM users WHERE email = ?';
    const [userCheckResult] = await db.execute(userCheckQuery, [email]);

    // console.log('User check query result:', userCheckResult);

    if (userCheckResult.length > 0) {
      // console.log('User already exists:', userCheckResult);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Hashed password:', hashedPassword);
    

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (email,technoid, password,department) VALUES (?, ?,?,?)';
    const [insertResult] = await db.execute(insertQuery, [email,Technoid, hashedPassword,role]);

    // console.log('User inserted successfully:', insertResult);

    res.status(201).json({
      message: 'Registration successful! Please login with your credentials.',
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 export default register;
