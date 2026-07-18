const Conversation = require('../../models/conversationModel');

// Check whether the conversation belongs to the current user.
exports.checkConversationOwner = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  return conversation;
};

// Update the conversation's last activity time.
exports.updateConversationTimestamp = async (conversationId) => {
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: Date.now(),
  });
};
