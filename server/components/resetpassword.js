const bcrypt = require('bcrypt');
const db = require('../databaseConnection/db');

const resetpassword = async (req, res) => {
    const { email, password } = req.body;
    // console.log('Incoming request body:', req.body);

    if (!email || !password) {
        // console.log('Missing email or password');
        return res.status(400).send('Email and new password are required.');
    }

    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 8);
        // console.log('Hashed password:', hashedPassword);

        // Query to update the password
        const query = 'UPDATE users SET password = ? WHERE email = ?';
        // console.log('Executing query:', query);
        // console.log('Query parameters:', [hashedPassword, email]);

        // Execute the query
        const [result] = await db.execute(query, [hashedPassword, email]);

        // console.log('Password reset result:', result);

        if (result.affectedRows === 0) {
            // console.log('User not found for email:', email);
            return res.status(404).send('User not found.');
        }

        // console.log('Password reset successfully for email:', email);
        res.send('Password reset successfully.');
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).send('Internal server error.');
    }
};

module.exports = { resetpassword };
