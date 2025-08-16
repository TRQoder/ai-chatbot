const { GoogleGenAI } = require("@google/genai");

// ✅ Automatically uses GEMINI_API_KEY from environment variables
const ai = new GoogleGenAI({});

/**
 * Generates a text response using Google Gemini AI.
 *
 * @param {string | Array<Object>} promptOrChatHistory
 *   - **String** → Sends a single, standalone prompt.
 *   - **Array**  → Sends an ongoing conversation in Gemini's
 *                  `{ role, parts }` format for short-term memory.
 *
 * @returns {Promise<string>} - AI's generated text response.
 *
 * 📌 Usage Tips:
 *   - For chatbots, maintain a **chatHistory** array.
 *   - Append new messages (both user & AI) after each interaction.
 *   - Pass the updated chatHistory to preserve short-term context.
 * 📝 Example — Single Prompt:
 *   const reply = await generateAiResponse("Hello Gemini!");
 *
 * 📝 Example — Chat History Format:
 *   const chatHistory = [
 *     {
 *       role: "user",
 *       parts: [{ text: "Hey, my name is Tarique" }]
 *     },
 *     {
 *       role: "model",
 *       parts: [{ text: "Hi Tarique! Nice to meet you." }]
 *     },
 *     {
 *       role: "user",
 *       parts: [{ text: "My age is 21" }]
 *     },
 *     {
 *       role: "model",
 *       parts: [{ text: "Got it, you are 21 years old." }]
 *     }
 *   ];
 *
 *   const reply = await generateAiResponse(chatHistory);
 */
const generateAiResponse = async (promptOrChatHistory) => {
  const response = await ai.models.generateContent({
    // model: "gemini-2.5-flash",  // 10rpm 250 rpd
    model : "gemini-2.5-flash-lite", // 15 rpm 1000rpd
    contents: promptOrChatHistory,
  });

  return response.text;
};

module.exports = generateAiResponse;




