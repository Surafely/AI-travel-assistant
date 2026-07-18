const { GoogleGenAI } = require('@google/genai');
// const { prompts } = require('./prompts');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.AI_MODEL || 'gemini-2.5-flash';

const generateContent = async ({ history, systemInstruction }) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,

      config: {
        systemInstruction,
      },

      contents: history,
    });

    return response.text;
  } catch (err) {
    console.error('Gemini Error:', err);
    throw err;
  }
};

module.exports = {
  generateContent,
};
