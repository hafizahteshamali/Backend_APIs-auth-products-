import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../Controllers/CartControllers.js";

const cartRoutes = express.Router();

cartRoutes.get("/", requireAuth, getCart);
cartRoutes.post("/add", requireAuth, addToCart);
cartRoutes.put("/item/:itemId", requireAuth, updateCartItem);
cartRoutes.delete("/item/:itemId", requireAuth, removeCartItem);
cartRoutes.delete("/clear", requireAuth, clearCart);

export default cartRoutes;