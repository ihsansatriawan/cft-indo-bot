import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { storeData } from './src/store-data.js';

const token = process.env.TOKEN_TELEGRAM;
const bot = new TelegramBot(token, { polling: true });
const allowUserName = ['ihsansatriawan', 'mutirowahani'];

const isUserAllowed = (userName) => allowUserName.includes(userName);

const handleIncomingMessage = async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.chat.username;

  if (!isUserAllowed(userName)) {
    const errorMessage = `User ${userName} is not allowed to use this bot.`;
    await bot.sendMessage(chatId, errorMessage);
    return;
  }

  try {
    const resultStore = await storeData(msg);

    for (const result of resultStore) {
      const { status, data } = result;
      const { date, category, notes, source, price } = JSON.parse(data);
      const message = `Received your message with Status: ${status}\nDate: ${date}\nCategory: ${category}\nNotes: ${notes}\nSource: ${source}\nPrice: ${price}`;
      await bot.sendMessage(chatId, message);
    }
  } catch (error) {
    console.error('Error processing message:', error);
    await bot.sendMessage(chatId, 'An error occurred while processing your message.');
  }
};

bot.on('message', handleIncomingMessage);