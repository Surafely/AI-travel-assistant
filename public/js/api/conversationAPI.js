import axios from 'axios';

export const getConversations = async () => {
  try {
    const res = await axios.get('/api/v1/conversations');

    return res.data.data.conversations;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createConversation = async () => {
  try {
    const res = await axios.post('/api/v1/conversations');

    return res.data.data.conversation;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteConversation = async (conversationId) => {
  try {
    await axios.delete(`/api/v1/conversations/${conversationId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateConversation = async (conversationId, title) => {
  try {
    const res = await axios.patch(`/api/v1/conversations/${conversationId}`, {
      title,
    });

    return res.data.data.conversation;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
