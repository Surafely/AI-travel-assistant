import axios from 'axios';

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
