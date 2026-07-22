const ChatMessage = require('../../models/chatMessageModel');

// Get all previous messages in chronological order.
exports.getConversationHistory = async (conversationId, limit = 10) => {
  const messages = await ChatMessage.find({
    conversation: conversationId,
  })
    .sort('-createdAt')
    .limit(limit)
    .select('role content')
    .lean();

  return messages.reverse();
};
