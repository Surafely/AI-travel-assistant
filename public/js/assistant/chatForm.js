import { createConversation } from '../api/conversationAPI';
import { sendMessage } from '../api/chatAPI';
import { state } from '../state/state';
import { loadConversations } from './sidebar';

import { appendMessage, showThinking, removeThinking } from './chatRenderer';

export const initChatForm = () => {
  const form = document.querySelector('.chat-form');
  const input = document.querySelector('.chat-input');

  if (!form || !input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      form.requestSubmit();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = input.value.trim();

    if (!content) return;

    if (!state.activeConversationId) {
      alert('Please select a conversation first.');
      return;
    }

    input.value = '';

    try {
      appendMessage({
        role: 'user',
        content,
      });

      showThinking();

      const result = await sendMessage(state.activeConversationId, content);

      await loadConversations();

      removeThinking();

      appendMessage(result.assistantMessage);
    } catch (err) {
      removeThinking();

      appendMessage({
        role: 'assistant',
        content:
          '⚠️ Sorry, I could not reach the AI service. Please try again in a moment.',
      });

      console.error(err);
    }
  });

  // Starter prompts
  document.addEventListener('click', async (e) => {
    const button = e.target.closest('.starter-prompt');

    if (!button) return;

    const message = button.textContent.trim();

    try {
      if (!state.activeConversationId) {
        const conversation = await createConversation();
        state.activeConversationId = conversation._id;
        await loadConversations();
      }

      input.value = message;
      form.requestSubmit();
    } catch (err) {
      console.error(err);
    }
  });
};
