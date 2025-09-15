import multer from "multer";
import storage from "../cloudinary/CloudinaryConfig.js";

const upload = multer({storage: storage})

export default upload;