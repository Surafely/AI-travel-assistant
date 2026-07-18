const ChatMessage = require('../../models/chatMessageModel');
// const Conversation = require('../../models/conversationModel');
const prompts = require('./prompts');

const AppError = require('../../utils/appError');

const { generateContent } = require('./gemini');
const { buildGeminiHistory } = require('./conversation');
const { saveUserMessage, saveAssistantMessage } = require('./messageService');
const { buildConversationContext } = require('./contextService');
const {
  checkConversationOwner,
  updateConversationTimestamp,
} = require('./conversationService');
const { generateConversationTitle } = require('./titleService');
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

  if (!conversation) {
    throw new AppError('Conversation not found or you do not own it.', 404);
  }

  // Save the user's message
  const userMessage = await saveUserMessage(
    conversationId,
    req.user.id,
    content,
  );

  // Retrieve the conversation history
  const context = await buildConversationContext(conversation);

  // Convert messages into Gemini format
  const history = buildGeminiHistory(context);

  // Generate AI response
  const aiReply = await generateContent({
    history,
    systemInstruction: prompts.system,
  });

  // Save the AI response
  const assistantMessage = await saveAssistantMessage(
    conversationId,
    aiReply,
    process.env.AI_MODEL,
  );

  // Generate summary if needed
  const totalMessages = await ChatMessage.countDocuments({
    conversation: conversation.id,
  });

  if (totalMessages > 0 && totalMessages % 20 === 0) {
    await updateConversationSummary(conversation);
  }

  if (conversation.title === 'New travel conversation') {
    const title = await generateConversationTitle(req.body.content);

    conversation.title = title.trim();

    await conversation.save();
  }

  // Update conversation timestamp
  await updateConversationTimestamp(conversationId);

  return {
    userMessage,
    assistantMessage,
  };
};
