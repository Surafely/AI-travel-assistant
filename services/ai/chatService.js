const ChatMessage = require('../../models/chatMessageModel');
const Conversation = require('../../models/conversationModel');

const AppError = require('../../utils/appError');

const { generateResponse } = require('./gemini');
const { buildGeminiHistory } = require('./conversation');

/**
 * Check whether the conversation belongs to the current user.
 */
const checkConversationOwner = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  return conversation;
};

/**
 * Get all previous messages in chronological order.
 */
const getConversationHistory = async (conversationId) => {
  const messages = await ChatMessage.find({
    conversation: conversationId,
  })
    .sort('createdAt')
    .select('role content');

  return messages;
};

/**
 * Save the user's message.
 */
const saveUserMessage = async (conversationId, userId, content) => {
  const message = await ChatMessage.create({
    conversation: conversationId,
    user: userId,
    role: 'user',
    content,
  });

  return message;
};

/**
 * Save the AI's response.
 */
const saveAssistantMessage = async (conversationId, content, model) => {
  const message = await ChatMessage.create({
    conversation: conversationId,
    role: 'assistant',
    content,
    metadata: {
      model,
    },
  });

  return message;
};

/**
 * Update the conversation's last activity time.
 */
const updateConversationTimestamp = async (conversationId) => {
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: Date.now(),
  });
};

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
  const messages = await getConversationHistory(conversationId);

  // Convert messages into Gemini format
  const history = buildGeminiHistory(messages);

  // Generate AI response
  const aiReply = await generateResponse(history);

  // Save the AI response
  const assistantMessage = await saveAssistantMessage(
    conversationId,
    aiReply,
    process.env.AI_MODEL,
  );

  // Update conversation timestamp
  await updateConversationTimestamp(conversationId);

  return {
    userMessage,
    assistantMessage,
  };
};
