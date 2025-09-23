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



// new logic



function combineElements(array) {
  if (array.length === 0)
    return [[]];

  const firstElement = array[0];
  const rest = array.slice(1);
  const withoutFirst = combineElements(rest);
  const withFirst = withoutFirst.map(el => [firstElement, ...el]);

  let res = [...withoutFirst, ...withFirst];
  return res
}

function generateCombos(counts, k) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const items = [];
  for (let i = 0; i < counts.length; i++) {
    for (let j = 1; j <= counts[i]; j++)
      items.push(letters[i] + j);
  }
  return items
}

function filterValidArrays(arrays, k) {
  const resArr = [];
  for (const combo of arrays) {
    if (combo.length !== k) continue;
    const letters = combo.map(x => x[0]);
    const unique = new Set(letters);
    if (unique.size !== letters.length) continue;
    resArr.push(combo);
  }
  return resArr;
}

let itemsInput = [1,2,2,1]
let length = 3

let letterItems = generateCombos(itemsInput, length)
let res = combineElements(letterItems)
console.log(filterValidArrays(res, length))

