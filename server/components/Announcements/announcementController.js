import db from "../../dbConnection/db.js";
import fs from 'fs/promises';
import dotenv from 'dotenv';
import uploadFileToS3 from '../../multer/uploadToS3.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const createannouncement = async (req, res) => {
    try {
        const { admin_id, title, content } = req.body;
         console.log(req.body,'bbbbbbbb');

        if (!admin_id || !title || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const ad_id=parseInt(admin_id);
        console.log(ad_id);

        // Check if the admin_id exists in the users table
        const [user] = await db.execute("SELECT id FROM users WHERE id = ?", [ad_id]);
         console.log(user,'uuuuuuuuuuu');

        if (user.length === 0) {
            return res.status(404).json({ message: "Admin user not found" });
        }

        let image_url = null;

        if (req.file) {
            const fileKey = await uploadFileToS3(req.file);
            image_url = fileKey;
            console.log(image_url);
            console.log(`Uploaded file to S3: ${image_url}`);

            // Delete local file after successful upload
            await fs.unlink(req.file.path);
            console.log(`Deleted local file: ${req.file.filename}`);
        }

        await db.execute(
            "INSERT INTO announcements (admin_id, title, content, image_url) VALUES (?, ?, ?, ?)",
            [admin_id, title, content, image_url]
        );

        res.status(201).json({ message: "Announcement posted successfully", image_url });
    } catch (error) {
        console.error("Error posting announcement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 🚀 Get All Announcements with Signed Image URLs
const getAnnouncement = async (req, res) => {
    try {
        const [announcements] = await db.execute("SELECT * FROM announcements ORDER BY created_at DESC");

        // Generate signed URLs for each announcement that has an image
        const updatedAnnouncements = await Promise.all(
            announcements.map(async (announcement) => {
                if (announcement.image_url) {
                    try {
                        const getObjectParams = {
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: announcement.image_url, // image_url contains the S3 key
                        };

                        const command = new GetObjectCommand(getObjectParams);
                        announcement.image_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1-hour expiration
                    } catch (error) {
                        console.error(`Error generating signed URL for image: ${announcement.image_url}`, error);
                        announcement.image_url = null; // Handle error gracefully
                    }
                }
                return announcement;
            })
        );
 console.log(updatedAnnouncements,'ann');
        res.status(200).json(updatedAnnouncements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { createannouncement, getAnnouncement };
