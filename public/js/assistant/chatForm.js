import { sendMessage } from '../api/chatAPI';

export const initChatForm = (conversationId) => {
  const form = document.querySelector('.chat-form');
  const input = document.querySelector('.chat-input');

  if (!form || !input) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = input.value.trim();

    if (!content) return;

    input.value = '';

    try {
      await sendMessage(conversationId, content);

      console.log('Message sent!');
    } catch (err) {
      console.error(err);
    }
  });
};
