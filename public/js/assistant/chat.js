import { getMessages } from '../api/messageAPI';
import { renderMessages } from './chatRenderer';

export const loadConversation = async (conversationId) => {
  try {
    const messages = await getMessages(conversationId);

    console.log(messages);
  } catch (err) {
    console.error(err);
  }
};
