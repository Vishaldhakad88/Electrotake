const express = require('express');
const router = express.Router();

const { listAllChats, getChatMessages } = require('../controllers/adminChatController');
const { adminAuth } = require('../middleware/auth');

// Admin chat monitoring (READ-ONLY)
router.get('/chats', adminAuth, listAllChats);
router.get('/chats/:chatId/messages', adminAuth, getChatMessages);

module.exports = router;
