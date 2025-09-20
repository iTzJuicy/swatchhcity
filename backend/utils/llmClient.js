import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * @param {Buffer} imageBuffer - The image data as a Buffer.
 * @returns {string} The MIME type of the image.
 */
const getMimeTypeFromBuffer = (imageBuffer) => {
  // Check for JPEG (starts with FF D8 FF)
  if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8 && imageBuffer[2] === 0xFF) {
    return "image/jpeg";
  }
  // Check for PNG (starts with 89 50 4E 47)
  if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 && imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47) {
    return "image/png";
  }
  return "application/octet-stream";
};

// Initialize client with API key from environment variables
const genAI = new GoogleGenerativeAI("AIzaSyAA86HbirUKz7ZgOjx5hQTjFHwfOCasFYU");

export const analyzeWasteImage = async (imageBuffer) => {
  const mimeType = getMimeTypeFromBuffer(imageBuffer);
  if (mimeType === "application/octet-stream") {
    throw new Error("Unsupported image format. Only JPEG and PNG are supported.");
  }

  // Get the model instance for a vision-capable model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Prepare the prompt and image data for the API request
  const parts = [
    { text: "Classify the waste in the image as 'wet', 'dry', or 'recyclable' or other , but need to provide one always. Provide concise composting and recycling advice based on the item. Respond in a strict JSON format with the keys 'category', 'compost_advice', and 'recyclable_advice'. Only provide the JSON object and no other text." },
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await result.response;
    const jsonOutput = response.text();
    
    // The API is configured to return JSON, so we can directly parse it.
    const parsedData = JSON.parse(jsonOutput);
    return parsedData;

  } catch (err) {
    console.error("Error analyzing image:", err);
    throw err;
  }
};