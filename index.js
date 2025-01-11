import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { storeData } from './src/store-data.js';
import { v4 as uuidv4 } from 'uuid';

const token = process.env.TOKEN_TELEGRAM;
const bot = new TelegramBot(token, { polling: true });
const allowUserName = ['ihsansatriawan', 'mutirowahani'];

const isUserAllowed = (userName) => allowUserName.includes(userName);

const handleIncomingMessage = async (msg) => {
  const responseID = uuidv4(); // Generate a unique response ID
  const chatId = msg.chat.id;
  const userName = msg.chat.username;

  if (!isUserAllowed(userName)) {
    const errorMessage = `User ${userName} is not allowed to use this bot.`;
    await bot.sendMessage(chatId, errorMessage);
    return;
  }

  try {
    const resultStore = await storeData(msg, responseID);
    const { status, data } = resultStore
    for (const result of data) {
      const { date, category, notes, source, price } = result;
      const message = `Received your message with Status: ${status}\nDate: ${date}\nCategory: ${category}\nNotes: ${notes}\nSource: ${source}\nPrice: ${price} \n\n\nUserName: ${userName} \nResponseID: ${responseID}`;
      await bot.sendMessage(chatId, message);
    }
  } catch (error) {
    console.error('Error processing message:', error);
    console.error('RsponseID: ', responseID);
    await bot.sendMessage(chatId, `An error occurred while processing your message. \n ResponseID: ${responseID}`);
  }
};

bot.on('message', handleIncomingMessage);

console.log("bot is running.....")