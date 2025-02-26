import db from "../dbConnection/db.js";

const insertTrainingData = async (req, res) => {
    const { phone, TrainingStatus, TrainingCompletedDate, id } = req.body;
     console.log(typeof(req.body.phone),"data usegcwedtrwa")

    try {
        const query = `
            INSERT INTO training_status (phone, training_status, training_completed_date, last_edited_id) 
            VALUES (?, ?, ?, ?)`;

        const values = [Number(phone), TrainingStatus, TrainingCompletedDate, id];

        await db.execute(query, values);
        
        res.status(201).json({ message: "Training data inserted successfully" });
    } catch (error) {
        console.error("Error inserting training data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default insertTrainingData;
