import { state } from '../state/state';
import { loadConversation } from './chat';

// const {loadConversation} = require('./chat')
// const {state} = require('../state/state')

export const renderConversationList = (conversations) => {
  const list = document.getElementById('conversation-list');

  if (!list) return;

  list.innerHTML = '';

  conversations.forEach((conversation) => {
    const isActive = conversation._id === state.activeConversationId;

    const html = `
      <li
        class="conversation-item ${isActive ? 'active' : ''}"
        data-id="${conversation._id}"
      >
        ${conversation.title}
      </li>
    `;

    list.insertAdjacentHTML('beforeend', html);
  });

  const items = list.querySelectorAll('.conversation-item');

  items.forEach((item) => {
    item.addEventListener('click', async () => {
      const conversationId = item.dataset.id;
      await loadConversation(conversationId);
      renderConversationList(state.conversations);
    });
  });
};
