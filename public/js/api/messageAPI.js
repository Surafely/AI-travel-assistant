import axios from 'axios';

export const getMessages = async (conversationId) => {
  try {
    const res = await axios.get(
      `/api/v1/conversations/${conversationId}/messages`,
    );

    return res.data.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendMessage = async (conversationId, content) => {
  try {
    const res = await axios.post(
      `/api/v1/conversations/${conversationId}/messages`,
      {
        content,
      },
    );

    return res.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
