import { Router } from "express";
import { generateHandler } from "../controllers/comboController.js";

const router = Router();
router.post("/generate", generateHandler);

export default router;
