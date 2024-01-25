// telegramService.js
const TelegramBot = require('node-telegram-bot-api');
const Cookies = require('cookies');
const axios = require('axios');
const bot = new TelegramBot('6412939057:AAF1QkPIoLKmud84ah4M9z7z2bi3-0ZbY-k', { polling: true });
const userStates = new Map();
const welcomedUsers = new Set();
const groupId = -4168858450;  //nhóm 2 người
const TelegramService = async () => {   
    // Bắt đầu lắng nghe sự kiện từ Telegram
    bot.on('polling_error', (error) => {
        console.error(`Polling error: ${error}`);
    });
    console.log('Telegram Bot is running...');
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;       
        if (!welcomedUsers.has(userId)) {           
            const welcomeMessage = `Chào mừng ${msg.from.first_name} đến với nhóm!`;
            bot.sendMessage(chatId, welcomeMessage);       
            welcomedUsers.add(userId);
        } else {            
           bot.sendMessage(chatId, 'Chào bạn! Tôi là Telegram bot. Tôi có thể giúp gì cho bạn?');
        }
    });
    bot.on('document', (msg) => {
        const chatId = msg.chat.id;
        const document = msg.document;
        if (document) {
          const fileName = document.file_name;
          const fileSize = document.file_size;
          this.bot.sendMessage(chatId, `📎 I got received: ${fileName} (${fileSize} bytes) from ${msg.from.first_name}`);
        }
      });     
}
const sendMessageToGroup = (message) => {   
    bot.sendMessage(groupId, message);
}

module.exports = {
    TelegramService,
    sendMessageToGroup

} 
