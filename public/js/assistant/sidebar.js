import { getConversations } from '../api/conversationAPI';
import { renderConversationList } from './renderer';
import { state } from '../state/state.js';

export const loadConversations = async () => {
  try {
    state.conversations = await getConversations();
    renderConversationList(state.conversations);
  } catch (err) {
    console.error(err);
  }
};

export const initSidebar = async () => {
  await loadConversations();
};

export const initMobileSidebar = async () => {
  const sidebar = document.querySelector('.assistant__sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggle = document.querySelector('.sidebar-toggle');
  const close = document.querySelector('.sidebar-close');

  if (!sidebar) return;

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  };

  toggle?.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  });

  close?.addEventListener('click', closeSidebar);

  overlay?.addEventListener('click', closeSidebar);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });
};
