import { loadConversation } from './chat';

export const renderConversationList = (conversations) => {
  const list = document.getElementById('conversation-list');

  if (!list) return;

  list.innerHTML = '';

  conversations.forEach((conversation) => {
    const html = `
      <li
        class="conversation-item"
        data-id="${conversation._id}"
      >
        ${conversation.title}
      </li>
    `;

    list.insertAdjacentHTML('beforeend', html);
  });

  const items = list.querySelectorAll('.conversation-item');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const conversationId = item.dataset.id;

      loadConversation(conversationId);
    });
  });
};
