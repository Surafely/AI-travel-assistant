const { getConversationHistory } = require('./conversationHistoryService');

exports.getConversationContext = async (conversation) => {
  const messages = await getConversationHistory(conversation.id);

  return {
    summary: conversation.summary,
    messages,
  };
};
