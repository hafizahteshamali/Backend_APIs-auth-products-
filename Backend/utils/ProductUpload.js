import multer from "multer";
import productStorage from "../cloudinary/ProductCloudinaryConfig.js";

const productUpload = multer({storage: productStorage});

export default productUpload;