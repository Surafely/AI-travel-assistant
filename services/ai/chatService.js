const ChatMessage = require('../../models/chatMessageModel');
// const Conversation = require('../../models/conversationModel');
const ai = require('./AIClient');
const AppError = require('../../utils/appError');

const { buildGeminiHistory } = require('./conversation');
const {
  saveUserMessage,
  saveAssistantMessage,
} = require('../conversation/messageService');

const { getConversationContext } = require('../conversation/contextService');

const {
  checkConversationOwner,
  updateConversationTimestamp,
} = require('../conversation/conversationService');

const { updateConversationTitle } = require('./titleService');
const { updateConversationSummary } = require('./summaryService');

exports.createMessage = async (req) => {
  const conversationId = req.params.conversationId || req.body.conversation;
  const { content } = req.body;

  if (!conversationId) {
    throw new AppError('Please provide a conversation ID.', 400);
  }

  const conversation = await checkConversationOwner(
    conversationId,
    req.user.id,
  );

  // Save the user's message
  const userMessage = await saveUserMessage(
    conversationId,
    req.user.id,
    content,
  );

  // Retrieve the conversation history
  const context = await getConversationContext(conversation);

  // Convert messages into Gemini format
  const history = buildGeminiHistory(context);

  // Generate AI response
  const aiReply = await ai.chat(history);

  // Save the AI response
  const assistantMessage = await saveAssistantMessage(
    conversationId,
    aiReply,
    process.env.AI_MODEL,
  );

  // Save the title
  await updateConversationTitle(conversation, req.body.content);

  // Generate summary if needed
  const totalMessages = await ChatMessage.countDocuments({
    conversation: conversation.id,
  });

  if (totalMessages > 0 && totalMessages % 20 === 0) {
    await updateConversationSummary(conversation);
  }

  // Update conversation timestamp
  await updateConversationTimestamp(conversationId);

  return {
    userMessage,
    assistantMessage,
  };
};

exports.getConversationMessages = async (conversationId) =>
  ChatMessage.find({
    conversation: conversationId,
  }).sort('createdAt');
