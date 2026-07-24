import { getConversations } from '../api/conversationAPI';
import { renderConversationList } from './renderer';

export const initSidebar = async () => {
  try {
    console.log('initSidebar called');

    const conversations = await getConversations();

    console.log(conversations);

    renderConversationList(conversations);
  } catch (err) {
    console.error(err);
  }
};
