const ai = require('./AIClient');
const { buildGeminiHistory } = require('./conversation');
const {
  getConversationHistory,
} = require('../conversation/conversationHistoryService');

const generateConversationSummary = async (messages) => {
  const history = buildGeminiHistory({
    summary: null,
    messages,
  });

  return ai.summarize(history);
};

exports.updateConversationSummary = async (conversation) => {
  const messages = await getConversationHistory(conversation.id, 20);
  const summary = await generateConversationSummary(messages);

  conversation.summary = summary;

  await conversation.save();
};
