// components/getCurrentUser.js
async function getCurrentUser(req, res) {
    try {
      const user = req.user; // Decoded user data from authenticateToken middleware
      //  console.log(user,'usersdmn');
      res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role, // Assuming role is user.department from your JWT
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  }
  
  export default getCurrentUser;