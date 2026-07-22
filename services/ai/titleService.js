// const { generateContent } = require('./gemini');
// const prompts = require('./prompts');

const ai = require('./AIClient');

const generateConversationTitle = async (content) => ai.generateTitle(content);

const updateConversationTitle = async (conversation, firstMessage) => {
  if (conversation.title !== 'New travel conversation') {
    return;
  }

  const title = await generateConversationTitle(firstMessage);

  conversation.title = title.trim();

  await conversation.save();
};

module.exports = {
  generateConversationTitle,
  updateConversationTitle,
};
