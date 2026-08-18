import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadToCloudinary = (buffer: Buffer, folder = "blog-images"): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};