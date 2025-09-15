import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appRoutes from "./Routes/AuthRoutes.js";
import DbConnection from "./Database/DbConnection.js";
import productRoutes from "./Routes/ProductRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send({ message: "Welcome to Backend Practice" });
});

app.use("/api/auth", appRoutes);
app.use("/api/products", productRoutes);

DbConnection()

app.listen(PORT, () => {
  console.log("Backend is Running on:", PORT);
});
