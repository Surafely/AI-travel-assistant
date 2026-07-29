const { createConversation } = require('../api/conversationAPI');
const { initSidebar } = require('./sidebar');
const { activeConversationId, loadConversation } = require('./chat');
// import { createConversation } from '../api/conversationAPI';

// import { initSidebar } from './sidebar';

// import { activeConversationId } from './chat';

export const initNewChat = () => {
  const button = document.querySelector('.btn--new-chat');

  if (!button) return;

  button.addEventListener('click', async () => {
    try {
      const conversation = await createConversation();
      await loadConversation(conversation._id);
      await initSidebar();
    } catch (err) {
      console.error(err);
    }
  });
};
