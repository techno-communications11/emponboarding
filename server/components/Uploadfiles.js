import db from '../dbConnection/db.js';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import uploadFileToS3 from '../multer/uploadToS3.js';

dotenv.config();

const Uploadfiles = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Get email from request body
        const { email } = req.body;
        console.log("Email:", email);

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if the email exists in the contract table
        const emailQuery = 'SELECT email FROM contract WHERE email = ?';
        const [result] = await db.execute(emailQuery, [email]);
         console.log(result);

        if (result.length === 0) {
            return res.status(400).json({ error: "Invalid email provided" });
        }

        // Upload file to S3 using the utility function
        const fileKey = await uploadFileToS3(req.file);
        const fileUrl = `${fileKey}`;
        console.log(`Uploaded file to S3: ${fileUrl}`);

        // Delete file from local storage
        await fs.unlink(req.file.path);
        console.log(`Deleted local file: ${req.file.filename}`);

        // Store the URL in the database
        const documentUrlsJson = JSON.stringify([fileUrl]); // Store as an array
        const updateQuery = `UPDATE contract SET document_url = ? WHERE email = ?`;
        const [updateResult] = await db.execute(updateQuery, [documentUrlsJson, email]);
         console.log(updateResult,"updated result");

        if (updateResult.affectedRows === 1) {
            return res.status(200).json({
                message: "Document uploaded successfully and stored in the database",
                url: fileUrl,
            });
        } else {
            return res.status(500).json({ error: "Failed to update database" });
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ error: "An error occurred while uploading the file" });
    }
};

export default Uploadfiles;