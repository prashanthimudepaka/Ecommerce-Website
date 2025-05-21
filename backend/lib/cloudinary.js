import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Validate Cloudinary configuration
const requiredEnvVars = ['CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required Cloudinary environment variables:', missingEnvVars);
    throw new Error('Cloudinary configuration is incomplete. Please check your .env file.');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the configuration
cloudinary.api.ping()
    .then(() => console.log('Cloudinary configuration is valid'))
    .catch(error => {
        console.error('Cloudinary configuration error:', error);
        throw new Error('Failed to connect to Cloudinary. Please check your credentials.');
    });

export default cloudinary;