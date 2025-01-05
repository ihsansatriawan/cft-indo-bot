import 'dotenv/config'

import TelegramBot from 'node-telegram-bot-api'
import { storeData } from './src/store-data.js'

const token = 'process.env.TOKEN_TELEGRAM';


const bot = new TelegramBot(token, {polling: true});


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
	const resultStore = await storeData(msg)

	console.log("resultStore: ", resultStore)

  for (const result of resultStore) {
    const { status, data } = result;
		const dataParse = JSON.parse(data)
    const { date, category, notes, source, price } = dataParse;
    const message = `Received your message with Status: ${status}\nDate: ${date}\nCategory: ${category}\nNotes: ${notes}\nSource: ${source}\nPrice: ${price}`;
    await bot.sendMessage(chatId, message);
  }
});