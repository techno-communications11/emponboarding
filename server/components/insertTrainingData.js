import db from "../dbConnection/db.js";

const insertTrainingData = async (req, res) => {
    const { phone, TrainingStatus, TrainingCompletedDate, techno_safety_control, id } = req.body;
     console.log(req.body);
    
    // Validate required fields
    if (!phone || !TrainingStatus || !TrainingCompletedDate || techno_safety_control === undefined || !id) {
        return res.status(400).json({ 
            message: "All fields (phone, TrainingStatus, TrainingCompletedDate, techno_safety_control, id) are required" 
        });
    }

    // Convert techno_safety_control to boolean (1 or 0)
    let safetyControlValue;
    if (typeof techno_safety_control === 'string') {
        safetyControlValue = techno_safety_control.toLowerCase() === 'yes' ? 1 : 0;
    } else if (typeof techno_safety_control === 'boolean') {
        safetyControlValue = techno_safety_control ? 1 : 0;
    } else {
        safetyControlValue = techno_safety_control === 1 ? 1 : 0;
    }

    try {
        // Check if record already exists for this phone
        const checkQuery = `SELECT phone FROM training_status WHERE phone = ?`;
        const [existing] = await db.execute(checkQuery, [phone]);

        if (existing.length > 0) {
            // Update existing record
            const updateQuery = `
                UPDATE training_status 
                SET training_status = ?, 
                    training_completed_date = ?, 
                    techno_safety_control = ?, 
                    last_edited_id = ?,
                    updatedat = NOW()
                WHERE phone = ?`;
            
            const updateValues = [
                TrainingStatus, 
                TrainingCompletedDate, 
                safetyControlValue, 
                id, 
                phone
            ];

            const [result] = await db.execute(updateQuery, updateValues);
            
            if (result.affectedRows > 0) {
                return res.status(200).json({ 
                    message: "Training data updated successfully",
                    updated: true
                });
            }
            return res.status(404).json({ message: "No record found to update" });
        } else {
            // Insert new record
            const insertQuery = `
                INSERT INTO training_status 
                (phone, training_status, training_completed_date, techno_safety_control, last_edited_id, createdat) 
                VALUES (?, ?, ?, ?, ?, NOW())`;

            const insertValues = [
                phone, 
                TrainingStatus, 
                TrainingCompletedDate, 
                safetyControlValue, 
                id
            ];

            const [result] = await db.execute(insertQuery, insertValues);
            
            return res.status(201).json({ 
                message: "Training data inserted successfully",
                insertedId: result.insertId
            });
        }
    } catch (error) {
        console.error("Error in training data operation:", error);
        return res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};

export default insertTrainingData;