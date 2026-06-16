const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: 'Conversation',
      required: [true, 'A chat message must belong to a conversation'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    role: {
      type: String,
      required: [true, 'A chat message must have a role'],
      enum: {
        values: ['user', 'assistant', 'system'],
        message: 'Chat message role must be user, assistant, or system',
      },
    },

    content: {
      type: String,
      required: [true, 'A chat message must have content'],
      trim: true,
      maxlength: [
        5000,
        'A chat message must have less or equal to 5000 characters.',
      ],
    },

    sources: [
      {
        title: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],

    metadata: {
      model: String,
      intent: String,
      destination: String,
      tripId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Trip',
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

chatMessageSchema.index({ conversation: 1, createdAt: 1 });
chatMessageSchema.index({ user: 1, createdAt: -1 });

chatMessageSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name email photo role',
  });
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
