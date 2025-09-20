import { analyzeWasteImage } from "../utils/llmClient.js";

export const categorizeWaste = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    // send image buffer to LLM
    const result = await analyzeWasteImage(req.file.buffer);

    // result: { category, confidence, advice, compostable, recyclable }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to analyze image" });
  }
};