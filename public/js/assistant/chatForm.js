import { sendMessage } from '../api/chatAPI';
import { activeConversationId } from './chat';

import { appendMessage, showThinking, removeThinking } from './chatRenderer';

export const initChatForm = () => {
  const form = document.querySelector('.chat-form');
  const input = document.querySelector('.chat-input');

  if (!form || !input) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = input.value.trim();

    if (!content) return;

    if (!activeConversationId) {
      alert('Please select a conversation first.');
      return;
    }

    input.value = '';

    try {
      // Show the user's message immediately
      appendMessage({
        role: 'user',
        content,
      });

      // Show the thinking indicator
      showThinking();

      // Send the request
      const result = await sendMessage(activeConversationId, content);

      // Remove the thinking indicator
      removeThinking();

      // Show Gemini's reply
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
};
