import multer from "multer";

const storage = multer.memoryStorage(); // store in memory for LLM upload
export const upload = multer({ storage });