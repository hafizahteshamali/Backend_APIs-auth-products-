import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const productStorage = new CloudinaryStorage({
    cloudinary,
    params: {
    folder: "Products_imagesss",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{width: 500, height: 500, crop: "limit"}]
    }
})

export default productStorage;