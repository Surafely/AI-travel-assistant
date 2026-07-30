import { state } from '../state/state';
import { loadConversation } from './chat';
import { loadConversations } from './sideBar';
import { deleteConversation } from '../api/conversationAPI';
import { updateConversation } from '../api/conversationAPI';

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
      <span class="conversation-item__icon">💬</span>
    
      <span class="conversation-item__title">
        ${conversation.title}
      </span>

      <button 
        class="conversation-rename"
        data-id="${conversation._id}"
        type="button"
      >

        ✏️
      </button>
    
      <button 
        class="conversation-delete"
        data-id="${conversation._id}"
        type="button"
      >
        🗑️
      </button>
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

  const deleteButtons = list.querySelectorAll('.conversation-delete');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const conversationId = button.dataset.id;

      const confirmed = confirm(
        'Are you sure you want to delete this conversation?',
      );

      if (!confirmed) return;

      try {
        await deleteConversation(conversationId);

        // If deleted conversation is currently open
        if (state.activeConversationId === conversationId) {
          state.activeConversationId = null;

          document.getElementById('messages').innerHTML = `
            <div class="chat-empty">
              <h2>👋 Welcome!</h2>
              <p>Start planning your next trip by asking me anything.</p>
            </div>
          `;
        }

        await loadConversations();
      } catch (err) {
        console.error(err);
      }
    });
  });

  const renameButtons = list.querySelectorAll('.conversation-rename');

  renameButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.stopPropagation();

      const conversationId = button.dataset.id;
      const newTitle = prompt('Enter a new conversation title:');

      if (!newTitle || !newTitle.trim()) return;

      console.log('Conversation ID:', conversationId);
      console.log('New title:', newTitle);

      try {
        console.log('Sending PATCH...');

        const updated = await updateConversation(
          conversationId,
          newTitle.trim(),
        );

        console.log('Updated conversation:', updated);

        await loadConversations();

        console.log('Sidebar refreshed.');
      } catch (err) {
        console.error(err);
      }
    });
  });
};
