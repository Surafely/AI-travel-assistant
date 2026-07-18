exports.buildGeminiHistory = ({ summary, messages }) => {
  const history = [];

  if (summary) {
    history.push({
      role: 'user',
      parts: [
        {
          text: `Conversation Summary:\n\n${summary}`,
        },
      ],
    });

    history.push({
      role: 'model',
      parts: [
        {
          text: 'Summary received.',
        },
      ],
    });
  }

  messages.forEach((message) => {
    history.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [
        {
          text: message.content,
        },
      ],
    });
  });

  return history;
};
