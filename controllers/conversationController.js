const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Conversation = require('../models/conversationModel');

exports.createConversation = catchAsync(async (req, res, next) => {
  // console.log('USER:', req.user);

  const conversation = await Conversation.create({
    user: req.user.id,
    // trip: req.body.trip,
    // title: req.body.title,
  });

  res.status(201).json({
    status: 'success',
    data: {
      conversation,
    },
  });
});

exports.getMyConversation = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    user: req.user.id,
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: conversations.length,
    data: {
      conversations,
    },
  });
});

exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!conversation) {
    return next(
      new AppError('Conversation not found or you do not own it', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      conversation,
    },
  });
});

exports.deleteConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
