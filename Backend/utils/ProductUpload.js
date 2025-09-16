import multer from "multer";
import productStorage from "../middlewares/ProductCloudinaryConfig.js";

const productUpload = multer({storage: productStorage});

export default productUpload;