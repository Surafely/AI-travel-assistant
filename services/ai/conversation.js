// services/ai/conversation.js

const { systemPrompt } = require('./prompts');

exports.buildGeminiHistory = (messages) => {
  const history = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Understood. I will act as an AI Travel Knowledge Assistant.',
        },
      ],
    },
  ];

  messages.forEach((message) => {
    history.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    });
  });

  return history;
};
