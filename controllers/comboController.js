import { createCombosService } from "../services/comboService.js";

export async function generateHandler(req, res) {
  try {
    const result = await createCombosService(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message ?? "Internal server error" });
  }
}
