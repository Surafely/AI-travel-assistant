import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const renderMessages = (messages) => {
  const container = document.getElementById('messages');

  if (!container) return;

  container.innerHTML = '';

  messages.forEach((message) => {
    const isUser = message.role === 'user';

    const html = `
      <div class="message ${isUser ? 'message--user' : 'message--assistant'}">
        <div class="message__bubble">
          ${
            isUser
              ? message.content
              : DOMPurify.sanitize(marked.parse(message.content))
          }
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', html);
  });

  container.scrollTop = container.scrollHeight;
};
