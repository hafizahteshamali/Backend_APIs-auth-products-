import multer from "multer";
import storage from "../middlewares/CloudinaryConfig.js";

const upload = multer({storage: storage})

export default upload;