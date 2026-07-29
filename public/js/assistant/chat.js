import { getMessages } from '../api/messageAPI';
import { renderMessages } from './chatRenderer';
import { state } from '../state/state.js';

export const loadConversation = async (conversationId) => {
  try {
    state.activeConversationId = conversationId;

    const messages = await getMessages(conversationId);
    renderMessages(messages);
  } catch (err) {
    console.error(err);
  }
};
