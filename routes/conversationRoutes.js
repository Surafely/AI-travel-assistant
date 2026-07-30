const express = require('express');
const conversationController = require('../controllers/conversationController');
const messageRouter = require('./chatMessageRoutes');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.use('/:conversationId/messages', messageRouter);

router
  .route('/')
  .get(conversationController.getMyConversation)
  .post(conversationController.createConversation);

router

  .route('/:id')
  .get(conversationController.getConversation)
  .patch(conversationController.updateConversation)
  .delete(conversationController.deleteConversation);

module.exports = router;
