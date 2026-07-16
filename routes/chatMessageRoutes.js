const express = require('express');
const chatMessageController = require('../controllers/chatMessageController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(chatMessageController.getConversationMessages)
  .post(chatMessageController.createMessage);

router.route('/:id').delete(chatMessageController.deleteMessage);

module.exports = router;

// router
//   .route('/conversation/:conversationId')
//   .get(chatMessageController.getConversationMessages);
