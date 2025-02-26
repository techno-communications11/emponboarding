const trainingteam = async (req, res) => {
    try {
      // Registration logic
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export default trainingteam;