import mongoose from "mongoose";

const comboSchema = new mongoose.Schema(
  {
    items: [Number],      
    length: Number,       
    combo: [String],     
  },
  { timestamps: true }
);


export const Combo = mongoose.model("Combo", comboSchema);
