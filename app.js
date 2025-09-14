import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import comboRoutes from "./routes/comboRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/combos_db?replicaSet=rs0";
await mongoose.connect(uri);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/", comboRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
