const { generateContent } = require('./gemini');
const { prompts } = require('./prompts');

exports.chat = async (history) =>
  generateContent({
    history,
    systemInstruction: prompts.system,
  });

exports.summarize = async (history) =>
  generateContent({
    history,
    systemInstruction: prompts.summarizeConversation,
  });

exports.generateTitle = async (content) =>
  generateContent({
    history: [
      {
        role: 'user',
        parts: [{ text: content }],
      },
    ],
    systemInstruction: prompts.generateTitle,
  });
