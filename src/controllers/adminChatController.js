const Chat = require('../models/Chat');
const ChatMessage = require('../models/ChatMessage');

/**
 * GET /api/v1/admin/chats
 * Admin chat list (read-only)
 */
async function listAllChats(req, res) {
  try {
    const chats = await Chat.find()
      .populate('user', 'name email')
      .populate('vendor', 'name email')
      .populate('product', 'title')
      .sort({ lastMessageAt: -1 });

    const result = await Promise.all(
      chats.map(async chat => {
        const unreadForUser = await ChatMessage.countDocuments({
          chat: chat._id,
          senderRole: 'vendor',
          isRead: false
        });

        const unreadForVendor = await ChatMessage.countDocuments({
          chat: chat._id,
          senderRole: 'user',
          isRead: false
        });

        return {
          _id: chat._id,
          user: chat.user,
          vendor: chat.vendor,
          product: chat.product,
          lastMessage: chat.lastMessage,
          lastMessageAt: chat.lastMessageAt,
          unreadForUser,
          unreadForVendor,
          createdAt: chat.createdAt
        };
      })
    );

    res.json({ chats: result });
  } catch (err) {
    console.error('[adminChatController] listAllChats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/v1/admin/chats/:chatId/messages
 * Admin view messages (read-only)
 */
async function getChatMessages(req, res) {
  try {
    const { chatId } = req.params;

    const messages = await ChatMessage.find({ chat: chatId })
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    console.error('[adminChatController] getChatMessages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  listAllChats,
  getChatMessages
};
