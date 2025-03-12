import db from "../../dbConnection/db.js";
// Register a new user
const Register = async (req, res) => {
  const { email, username,Technoid, password, department } = req.body;
   console.log(req.body,'register')

  // Validate input
  if (!email || !password || !department) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    // Check if the user already exists
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert the new user into the database
    const [result] = await db.execute(
        'INSERT INTO users (email, username,Technoid, password, department) VALUES (?, ?, ?, ?,?)',
        [email, username,Technoid, password, department]
      );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

// Fetch all users
const userdata = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM users');
     console.log(users)
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { salary, position_id } = req.body;

  // Validate input
  if (!salary && !position_id) {
    return res.status(400).json({ message: 'At least one field (salary or position_id) is required' });
  }

  try {
    // Update the user in the database
    await db.execute('UPDATE users SET salary = ?, position = ? WHERE id = ?', [
        salary,
        position_id,
        userId,
      ]);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export { userdata, updateUser, Register };