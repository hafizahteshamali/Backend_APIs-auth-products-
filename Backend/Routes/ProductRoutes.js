import express from "express";
import { AddProductsController, DeleteProductsController, GetProductsController, GetSingleProductController, SearchProductController, UpdateProductsController } from "../Controllers/ProductControllers.js";
import productUpload from "../utils/ProductUpload.js";

const productRoutes = express.Router();

productRoutes.post("/", productUpload.fields([
    {name: 'images', maxCount: 5}
]), AddProductsController);
productRoutes.get("/", GetProductsController);
productRoutes.get("/search-product", SearchProductController)
productRoutes.get("/:id", GetSingleProductController);
productRoutes.delete("/:id", DeleteProductsController);
productRoutes.put("/:id", productUpload.fields([
    {name: 'images', maxCount: 5}
]), UpdateProductsController);

export default productRoutes;