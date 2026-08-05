// const ChatMessage = require('../models/chatMessageModel');
// const Conversation = require('../models/conversationModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/ai/chatService');

exports.getConversationMessages = catchAsync(async (req, res, next) => {
  const result = await chatService.getConversationMessages(
    req.params.conversationId,
  );

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      data: result,
    },
  });
});

exports.createMessage = catchAsync(async (req, res, next) => {
  const result = await chatService.createMessage(req);

  res.status(201).json({
    status: 'success',
    data: {
      data: result,
    },
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  await chatService.deleteMessage(req);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
