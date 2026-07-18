const ChatMessage = require('../../models/chatMessageModel');
const Conversation = require('../../models/conversationModel');
const prompts = require('./prompts');

const AppError = require('../../utils/appError');

const { generateContent } = require('./gemini');
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
const getConversationHistory = async (conversationId, limit = 10) => {
  const messages = await ChatMessage.find({
    conversation: conversationId,
  })
    .sort('-createdAt')
    .limit(limit)
    .select('role content')
    .lean();

  return messages.reverse();
};

const buildConversationContext = async (conversation) => {
  const messages = await getConversationHistory(conversation.id);

  return {
    summary: conversation.summary,
    messages,
  };
};

const generateConversationTitle = async (content) =>
  generateContent({
    history: [
      {
        role: 'user',
        parts: [
          {
            text: content,
          },
        ],
      },
    ],

    systemInstruction: prompts.generateTitle,
  });

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

const updateConversationSummary = async (conversation) => {
  const messages = await getConversationHistory(conversation.id, 20);
  const summary = await generateConversationSummary(messages);

  conversation.summary = summary;

  await conversation.save();
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
