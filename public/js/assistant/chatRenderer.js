import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const appendMessage = (message) => {
  const container = document.getElementById('messages');

  if (!container) return;

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

  container.scrollTop = container.scrollHeight;
};

export const showThinking = () => {
  const container = document.getElementById('messages');

  if (!container) return;

  container.insertAdjacentHTML(
    'beforeend',
    `
      <div
        class="message message--assistant"
        id="thinking"
      >
        <div class="message__bubble">
          ✈️ AI Travel Assistant is thinking...
        </div>
      </div>
    `,
  );

  container.scrollTop = container.scrollHeight;
};

export const removeThinking = () => {
  document.getElementById('thinking')?.remove();
};

export const renderMessages = (messages) => {
  const container = document.getElementById('messages');

  if (!container) return;

  container.innerHTML = '';

  if (messages.length === 0) {
    container.innerHTML = `
  <div class="chat-empty">
    <h2>👋 Welcome!</h2>
    <p>Start planning your next trip by asking me anything.</p>

    <div class="starter-prompts">
      <button class="starter-prompt">
        🌍 Plan a 7-day trip to Japan
      </button>

      <button class="starter-prompt">
        💰 Find budget-friendly destinations
      </button>

      <button class="starter-prompt">
        🏖️ Create a beach vacation itinerary
      </button>

      <button class="starter-prompt">
        ✈️ Help me plan my honeymoon
      </button>
    </div>
  </div>
`;

    return;
  }

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
