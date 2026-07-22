const Conversation = require('../../models/conversationModel');
const AppError = require('../../utils/appError');

// Check whether the conversation belongs to the current user.
exports.checkConversationOwner = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError('Conversation not found or you do not own it.', 404);
  }

  return conversation;
};

// Update the conversation's last activity time.
exports.updateConversationTimestamp = async (conversationId) => {
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: Date.now(),
  });
};
