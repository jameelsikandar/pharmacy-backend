import { cloudinary } from "../config/cloudinary.config";
import fs from "fs/promises";

const uploadToCloudinary = async (localFilePath: string, maxRetries = 3, delayMs = 1000) => {
    if (!localFilePath) return null;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            });
            console.log(`File uploaded to Cloudinary (attempt ${attempt}):`, response.secure_url);

            await fs.unlink(localFilePath).catch((err) => {
                console.log("Error while deleting image from server: ", err);
            });
            return response;
        } catch (error) {
            lastError = error;

            console.error(`Cloudinary upload failed (attempt ${attempt}):`, error);

            if (attempt < maxRetries) {
                console.log(`Retrying in ${delayMs}ms...`);
                await new Promise((res) => setTimeout(res, delayMs));
            } else {
                await fs.unlink(localFilePath).catch((err) => {
                    console.log("Error while deleting image from server: ", err);
                });

                throw lastError;
            }
        }
    }
};
export { uploadToCloudinary };
