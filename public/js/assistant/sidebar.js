import { getConversations } from '../api/conversationAPI';
import { renderConversationList } from './renderer';
import { state } from '../state/state.js';

export const initSidebar = async () => {
  try {
    state.conversations = await getConversations();
    renderConversationList(state.conversations);
  } catch (err) {
    console.error(err);
  }
};
