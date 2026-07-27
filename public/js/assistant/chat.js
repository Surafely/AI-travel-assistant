import { getMessages } from '../api/messageAPI';
import { renderMessages } from './chatRenderer';

export let activeConversationId = null;

export const loadConversation = async (conversationId) => {
  try {
    activeConversationId = conversationId;

    const messages = await getMessages(conversationId);

    renderMessages(messages);
  } catch (err) {
    console.error(err);
  }
};
