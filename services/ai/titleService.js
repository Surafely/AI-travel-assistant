const { generateContent } = require('./gemini');
const prompts = require('./prompts');

exports.generateConversationTitle = async (content) =>
  generateContent({
    history: [
      {
        role: 'user',
        parts: [
          {
            text: content,
          },
        ],
      },
    ],

    systemInstruction: prompts.generateTitle,
  });
