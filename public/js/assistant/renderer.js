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

  document.querySelectorAll('.conversation-item').forEach((item) => {
    item.addEventListener('click', () => {
      loadConversation(item.dataset.id);
    });
  });
};
