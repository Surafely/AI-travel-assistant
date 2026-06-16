const ChatMessage = require('../models/chatMessageModel');
const Conversation = require('../models/conversationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const checkConversationOwner = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  return conversation;
};

exports.createMessage = catchAsync(async (req, res, next) => {
  const conversationId = req.params.conversationId || req.body.conversation;

  if (!conversationId) {
    return next(new AppError('Please provide a conversation ID', 400));
  }

  const conversation = await checkConversationOwner(
    conversationId,
    req.user.id,
  );

  if (!conversation) {
    return next(
      new AppError('Conversation not found or you do not own it', 404),
    );
  }

  const message = await ChatMessage.create({
    conversation: conversationId,
    user: req.user.id,
    role: req.body.role || 'user',
    content: req.body.content,
    sources: req.body.sources,
    metadata: req.body.metadata,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: Date.now(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      message,
    },
  });
});

exports.getConversationMessages = catchAsync(async (req, res, next) => {
  const conversation = await checkConversationOwner(
    req.params.conversationId,
    req.user.id,
  );

  if (!conversation) {
    return next(
      new AppError('Conversation not found or you do not own it', 404),
    );
  }

  const messages = await ChatMessage.find({
    conversation: req.params.conversationId,
  }).sort('createdAt');

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      data: messages,
    },
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    return next(new AppError('Please provide a conversation ID', 400));
  }

  const conversation = await checkConversationOwner(
    conversationId,
    req.user.id,
  );

  if (!conversation) {
    return next(
      new AppError('Conversation not found or you do not own it', 404),
    );
  }

  const message = await ChatMessage.findOneAndDelete({
    _id: req.params.id,
    conversation: conversationId,
  });

  if (!message) {
    return next(new AppError('Message not found in this conversation', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
