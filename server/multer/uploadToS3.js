import fs from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from './awsConfig.js';

const uploadFileToS3 = async (file) => {
    try {
        if (!file || !file.filename) {
            throw new Error('Invalid file uploaded.');
        }

        const filePath = path.resolve('uploads', file.filename);
        console.log('File path:', filePath);

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileContent = fs.readFileSync(filePath);
        const s3Key = `profilePhotos/${file.filename}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: fileContent,
            ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(params));
        console.log(`File uploaded to S3: ${s3Key}`);
        return s3Key;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};

export default uploadFileToS3;