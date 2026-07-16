// const ChatMessage = require('../models/chatMessageModel');
// const Conversation = require('../models/conversationModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/ai/chatService');

exports.getConversationMessages = catchAsync(async (req, res, next) => {
  const result = await chatService.getConversationMessages(req);

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

// exports.createMessage = catchAsync(async (req, res, next) => {
//   const conversationId = req.params.conversationId || req.body.conversation;

//   if (!conversationId) {
//     return next(new AppError('Please provide a conversation ID', 400));
//   }

//   const conversation = await checkConversationOwner(
//     conversationId,
//     req.user.id,
//   );

//   if (!conversation) {
//     return next(
//       new AppError('Conversation not found or you do not own it', 404),
//     );
//   }

//   const message = await ChatMessage.create({
//     conversation: conversationId,
//     user: req.user.id,
//     role: req.body.role || 'user',
//     content: req.body.content,
//     sources: req.body.sources,
//     metadata: req.body.metadata,
//   });

//   // const history = await ChatMessage.find({
//   //   conversation: conversationId,
//   // })
//   //   .sort('createdAt')
//   //   .select('role content');

//   await Conversation.findByIdAndUpdate(conversationId, {
//     lastMessageAt: Date.now(),
//   });

//   res.status(201).json({
//     status: 'success',
//     data: {
//       message,
//     },
//   });
// });

// exports.createMessage = catchAsync(async (req, res, next) => {
//   const result = await chatService.createMessage(req);

//   res.status(201).json({
//     status: 'success',
//     data: result,
//   });
// });

// exports.getConversationMessages = catchAsync(async (req, res, next) => {
//   const conversation = await checkConversationOwner(
//     req.params.conversationId,
//     req.user.id,
//   );

//   if (!conversation) {
//     return next(
//       new AppError('Conversation not found or you do not own it', 404),
//     );
//   }

//   const messages = await ChatMessage.find({
//     conversation: req.params.conversationId,
//   }).sort('createdAt');

//   res.status(200).json({
//     status: 'success',
//     results: messages.length,
//     data: {
//       data: messages,
//     },
//   });
// });

// exports.deleteMessage = catchAsync(async (req, res, next) => {
//   const { conversationId } = req.params;

//   if (!conversationId) {
//     return next(new AppError('Please provide a conversation ID', 400));
//   }

//   const conversation = await checkConversationOwner(
//     conversationId,
//     req.user.id,
//   );

//   if (!conversation) {
//     return next(
//       new AppError('Conversation not found or you do not own it', 404),
//     );
//   }

//   const message = await ChatMessage.findOneAndDelete({
//     _id: req.params.id,
//     conversation: conversationId,
//   });

//   if (!message) {
//     return next(new AppError('Message not found in this conversation', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
