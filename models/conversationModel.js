const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A conversation must belong to a user'],
    },

    trip: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trip',
    },

    title: {
      type: String,
      trim: true,
      maxlength: [
        120,
        'A conversation title must have less or equal to 120 characters.',
      ],
      default: 'New travel conversation',
    },

    status: {
      type: String,
      enum: {
        values: ['active', 'archived', 'closed'],
        message: 'Conversation status must be active, archived, or closed',
      },
      default: 'active',
    },

    summary: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        'A conversation summary must have less or equal to 1000 characters.',
      ],
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

conversationSchema.index({ user: 1, lastMessageAt: -1 });
conversationSchema.index({ status: 1 });

conversationSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name email photo role',
  }).populate({
    path: 'trip',
    select: 'name destination price duration imageCover',
  });
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
