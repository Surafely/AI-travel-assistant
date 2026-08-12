import { state } from '../state/state';
import { loadConversation } from './chat';
import { loadConversations } from './sidebar';
import { deleteConversation } from '../api/conversationAPI';
import { updateConversation } from '../api/conversationAPI';
import { showToast } from '../toast';

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
        class="conversation-menu"
        type="button"
      >
        ⋮
      </button>

      <div class="conversation-actions">
        <button 
          class="conversation-rename"
          data-id="${conversation._id}"
          type="button"
        >
          Rename
        </button>

        <button 
          class="conversation-delete"
          data-id="${conversation._id}"
          type="button"
        >
          Delete
        </button>
      </div>
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
        showToast('Conversation deleted successfully.');
      } catch (err) {
        console.error(err);

        showToast(
          err.response?.data?.message || 'Failed to delete conversation.',
          'error',
        );
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

      try {
        const updated = await updateConversation(
          conversationId,
          newTitle.trim(),
        );

        await loadConversations();

        showToast('Conversation renamed successfully.');
      } catch (err) {
        console.error(err);

        showToast(
          err.response?.data?.message || 'Failed to rename conversation.',
          'error',
        );
      }
    });
  });

  const menuButtons = list.querySelectorAll('.conversation-menu');

  menuButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();

      const item = button.closest('.conversation-item');

      item.querySelector('.conversation-actions').classList.toggle('show');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.conversation-actions').forEach((menu) => {
      menu.classList.remove('show');
    });
  });

  const actionMenus = list.querySelectorAll('.conversation-actions');

  actionMenus.forEach((menu) => {
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
};
