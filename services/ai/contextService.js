const { getConversationHistory } = require('./conversationHistoryService');

exports.buildConversationContext = async (conversation) => {
  const messages = await getConversationHistory(conversation.id);

  return {
    summary: conversation.summary,
    messages,
  };
};
