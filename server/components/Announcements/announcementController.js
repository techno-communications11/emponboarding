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
        //  console.log(req.body,'bbbbbbbb');

        if (!admin_id || !title || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const ad_id=parseInt(admin_id);
        console.log(ad_id);

        // Check if the admin_id exists in the users table
        const [user] = await db.execute("SELECT id FROM users WHERE id = ?", [ad_id]);
        //  console.log(user,'uuuuuuuuuuu');

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
      const query = `
          SELECT 
              a.id AS announcement_id,
              a.title,
              a.content,
              a.created_at,
              a.image_url,
              u.username AS username,
              SUM(CASE WHEN ar.reaction_type = 'LIKED' THEN 1 ELSE 0 END) AS likes,
              SUM(CASE WHEN ar.reaction_type = 'DISLIKE' THEN 1 ELSE 0 END) AS dislikes,
              c.comment AS user_comment,
              cu.username AS user_who_commented,
              c.created_at AS comment_time
          FROM announcements a
          LEFT JOIN users u ON u.id = a.admin_id
          LEFT JOIN announcement_reactions ar ON a.id = ar.announcement_id
          LEFT JOIN announcement_comments c ON a.id = c.announcement_id
          LEFT JOIN users cu ON c.user_id = cu.id
          GROUP BY a.id, u.username, cu.username, c.comment, c.created_at
          ORDER BY a.id DESC, c.created_at DESC;
      `;

      const [announcements] = await db.execute(query);

      // Process announcements to group comments properly
      const announcementsMap = new Map();

      announcements.forEach((row) => {
          if (!announcementsMap.has(row.announcement_id)) {
              announcementsMap.set(row.announcement_id, {
                  id: row.announcement_id,
                  title: row.title,
                  content: row.content,
                  created_at: row.created_at,
                  image_url: row.image_url,
                  username: row.username,
                  likes: row.likes || 0,
                  dislikes: row.dislikes || 0,
                  comments: []
              });
          }

          if (row.user_comment) {
              announcementsMap.get(row.announcement_id).comments.push({
                  comment: row.user_comment,
                  username: row.user_who_commented,
                  created_at: row.comment_time
              });
          }
      });

      let updatedAnnouncements = Array.from(announcementsMap.values());

      // Generate signed URLs for images
      updatedAnnouncements = await Promise.all(
          updatedAnnouncements.map(async (announcement) => {
              if (announcement.image_url) {
                  try {
                      const getObjectParams = {
                          Bucket: process.env.AWS_BUCKET_NAME,
                          Key: announcement.image_url,
                      };

                      const command = new GetObjectCommand(getObjectParams);
                      announcement.image_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                  } catch (error) {
                      console.error(`Error generating signed URL for image: ${announcement.image_url}`, error);
                      announcement.image_url = null;
                  }
              }
              return announcement;
          })
      );
 console.log(updatedAnnouncements,'oooooooooop')
      res.status(200).json(updatedAnnouncements);
  } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};



const comment = async (req, res) => {
    const { id, comment, userid } = req.body;
    console.log(req.body, 'Incoming comment request');

    // Validate input data
    if (!id || !comment || !userid) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        // SQL query to insert the comment into the database
        const query = `
            INSERT INTO announcement_comments (announcement_id, user_id, comment, created_at)
            VALUES (?, ?, ?, NOW())
        `;

        // Execute query
        const [result] = await db.execute(query, [id, userid, comment]);

        // Send response
        res.status(201).json({ message: "Comment added successfully", commentId: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding comment" });
    }
};


const likeAnnouncement = async (req, res) => {
  const { id, userid } = req.body; // `id` is announcement_id

  if (!id || !userid) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    // Insert OR update reaction to 'LIKED'
    await db.query(
      `INSERT INTO announcement_reactions (announcement_id, user_id, reaction_type) 
       VALUES (?, ?, 'LIKED') 
       ON DUPLICATE KEY UPDATE reaction_type = 'LIKED'`,
      [id, userid]
    );

    res.json({ message: "Liked successfully" });
  } catch (error) {
    console.error("Error liking announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const dislikeAnnouncement = async (req, res) => {
  const { id, userid } = req.body;

  if (!id || !userid) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    // Insert OR update reaction to 'DISLIKED'
    await db.query(
      `INSERT INTO announcement_reactions (announcement_id, user_id, reaction_type) 
       VALUES (?, ?, 'DISLIKED') 
       ON DUPLICATE KEY UPDATE reaction_type = 'DISLIKED'`,
      [id, userid]
    );

    res.json({ message: "Disliked successfully" });
  } catch (error) {
    console.error("Error disliking announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
};





export { createannouncement, getAnnouncement,comment,likeAnnouncement,dislikeAnnouncement };
