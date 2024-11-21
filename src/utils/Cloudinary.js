import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
})

export const uploadCloudinaryFile = async (file) => {
    try {
        const base64File = file.buffer.toString("base64");
        const fileExtension = file.originalname.split('.').pop();

        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${base64File}`,
            {
                resource_type: "raw",
                format: fileExtension
            }
        );

        return result;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw new Error("File upload failed");
    }
};

export const uploadCloudinaryImage = async (image) => {
    try {

        const transform1 = [
            { width: 350, height: 350, crop: "fit" },
            { quality: 80 },
            { fetch_format: "webp" },
        ]
        

        const base64Image = image.buffer.toString("base64");
        const result = await cloudinary.uploader.upload(
            `data:${image.mimetype};base64,${base64Image}`,
            {
                transformation: transform1
            }
        );
        return result;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
};
