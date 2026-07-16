const { GoogleGenAI } = require('@google/genai');

// console.log('GEMINI_API_KEY', process.env.GEMINI_API_KEY);
// console.log('AI_MODEL', process.env.AI_MODEL);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.AI_MODEL;

const generateResponse = async (contents) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
    });

    return response.text;
  } catch (err) {
    console.error('Gemini Error:', err);
    throw err;
  }
};

module.exports = {
  generateResponse,
};
