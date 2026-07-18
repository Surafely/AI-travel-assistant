const { generateContent } = require('./gemini');
const { buildGeminiHistory } = require('./conversation');
const prompts = require('./prompts');
const { getConversationHistory } = require('./conversationHistoryService');

const generateConversationSummary = async (messages) => {
  const history = buildGeminiHistory({
    summary: null,
    messages,
  });

  return generateContent({
    history,
    systemInstruction: prompts.summarizeConversation,
  });
};

exports.updateConversationSummary = async (conversation) => {
  const messages = await getConversationHistory(conversation.id, 20);
  const summary = await generateConversationSummary(messages);

  conversation.summary = summary;

  await conversation.save();
};
