const ChatMessage = require('../../models/chatMessageModel');

// Save the user's message.

exports.saveUserMessage = async (conversationId, userId, content) => {
  const message = await ChatMessage.create({
    conversation: conversationId,
    user: userId,
    role: 'user',
    content,
  });

  return message;
};

// Save the AI's response.

exports.saveAssistantMessage = async (conversationId, content, model) => {
  const message = await ChatMessage.create({
    conversation: conversationId,
    role: 'assistant',
    content,
    metadata: {
      createdBy: 'gemini',
      model,
    },
  });

  return message;
};
