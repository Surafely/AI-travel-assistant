// const { generateContent } = require('./gemini');
// const prompts = require('./prompts');

const ai = require('./AIClient');

const generateConversationTitle = async (content) => ai.generateTitle(content);

const updateConversationTitle = async (conversation, firstMessage) => {
  if (conversation.title !== 'New travel conversation') return;

  try {
    const title = await generateConversationTitle(firstMessage);
    if (title && title.trim()) {
      conversation.title = title.trim();
      await conversation.save();
    }
  } catch (err) {
    console.error('Failed to generate conversation title:', err);
    // Keep the default title if generation fails
  }
};

module.exports = {
  generateConversationTitle,
  updateConversationTitle,
};
