import mongoose from "mongoose";
import { Combo } from "../models/Combo.js";

export function generateCombos(counts, k) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const items = [];
  for (let i = 0; i < counts.length; i++) {
    for (let j = 1; j <= counts[i]; j++) items.push(letters[i] + j);
  }
  const result = [];
  function samePrefix(a, b) { return a[0] === b[0]; }
  function backtrack(start, combo) {
    if (combo.length === k) { result.push([...combo]); return; }
    for (let i = start; i < items.length; i++) {
      const item = items[i];
      if (combo.some(x => samePrefix(x, item))) continue;
      combo.push(item);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }
  backtrack(0, []);
  return result;
}

export async function createCombosService(payload) {
  const { items, length } = payload;

  const combos = generateCombos(items, length);

  const docs = combos.map(c => ({ items, length, combo: c }));

  const session = await mongoose.startSession();
  let savedDocs = [];
  try {
    await session.withTransaction(async () => {
      await Combo.insertMany(docs, { session });
      savedDocs = await Combo.find({ items, length }, null, { session })
          .select("_id combo")
          .lean();
    });
  } finally {
    await session.endSession();
  }

  return {
    id: Date.now(),
    combination: savedDocs.map(d => d.combo)
  };
}

