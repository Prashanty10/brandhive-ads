import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder = "brandhive") => {
  if (!file) throw new Error("No file provided");

  try {
    if (typeof file === "string" && file.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: "image",
        timeout: 120000, // 2-minute timeout limit
      });
      return result;
    }

    if (Buffer.isBuffer(file)) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image", timeout: 120000 },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(file);
      });
    }

    return { secure_url: file };
  } catch (error) {
    console.error("Cloudinary upload warning:", error.message || error);
    // Return data URL or original URL as fallback instead of throwing error
    if (typeof file === "string") {
      return { secure_url: file };
    }
    return { secure_url: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&auto=format&fit=crop&q=80" };
  }
};

export default uploadToCloudinary;
