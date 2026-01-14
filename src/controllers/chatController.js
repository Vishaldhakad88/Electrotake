const Chat = require('../models/Chat');
const ChatMessage = require('../models/ChatMessage');
const Product = require('../models/Product');

/**
 * USER starts or gets chat
 */
async function startChat(req, res) {
  try {
    const userId = req.user._id; // ✅ correct
    const { vendorId, productId } = req.body;

    if (!vendorId || !productId) {
      return res.status(400).json({ error: 'vendorId and productId are required' });
    }

    const product = await Product.findOne({ _id: productId, vendor: vendorId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found for this vendor' });
    }

    let chat = await Chat.findOne({
      user: userId,
      vendor: vendorId,
      product: productId
    });

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        vendor: vendorId,
        product: productId
      });
    }

    res.json({ chat });
  } catch (err) {
    console.error('[chatController] startChat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * SEND MESSAGE (USER / VENDOR)
 */
async function sendMessage(req, res) {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    let senderRole, senderId;

    if (req.user) {
      if (!chat.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      senderRole = 'user';
      senderId = req.user._id; // ✅ FIXED
    } else if (req.vendor) {
      if (!chat.vendor.equals(req.vendor._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      senderRole = 'vendor';
      senderId = req.vendor._id;
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const msg = await ChatMessage.create({
      chat: chatId,
      senderRole,
      senderId,
      message: message.trim(),
      isRead: false
    });

    chat.lastMessage = message.trim();
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json({ message: msg });
  } catch (err) {
    console.error('[chatController] sendMessage error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET MESSAGES + mark as read
 */
async function getMessages(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    let readFilter = {};

    if (req.user) {
      if (!chat.user.equals(req.user._id)) { // ✅ FIXED
        return res.status(403).json({ error: 'Forbidden' });
      }
      readFilter = { chat: chatId, senderRole: 'vendor', isRead: false };
    }

    if (req.vendor) {
      if (!chat.vendor.equals(req.vendor._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      readFilter = { chat: chatId, senderRole: 'user', isRead: false };
    }

    await ChatMessage.updateMany(readFilter, { $set: { isRead: true } });

    const messages = await ChatMessage.find({ chat: chatId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    console.error('[chatController] getMessages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * USER chat list + unread count
 */
async function userChats(req, res) {
  const chats = await Chat.find({ user: req.user._id }) // ✅ FIXED
    .populate('product', 'title')
    .populate('vendor', 'name')
    .sort({ lastMessageAt: -1 });

  const result = await Promise.all(
    chats.map(async chat => {
      const unreadCount = await ChatMessage.countDocuments({
        chat: chat._id,
        senderRole: 'vendor',
        isRead: false
      });
      return { ...chat.toObject(), unreadCount };
    })
  );

  res.json({ chats: result });
}

/**
 * VENDOR chat list + unread count
 */
async function vendorChats(req, res) {
  const chats = await Chat.find({ vendor: req.vendor._id })
    .populate('product', 'title')
    .populate('user', 'name')
    .sort({ lastMessageAt: -1 });

  const result = await Promise.all(
    chats.map(async chat => {
      const unreadCount = await ChatMessage.countDocuments({
        chat: chat._id,
        senderRole: 'user',
        isRead: false
      });
      return { ...chat.toObject(), unreadCount };
    })
  );

  res.json({ chats: result });
}

module.exports = {
  startChat,
  sendMessage,
  getMessages,
  userChats,
  vendorChats
};
