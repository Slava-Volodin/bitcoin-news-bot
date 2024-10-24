const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Токен Telegram-бота
const TELEGRAM_TOKEN = '7655391412:AAGlcXTKgxgm91LBEVcviMy3-hJ2o2OdW-8';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// API ключ CryptoPanic
const CRYPTOPANIC_API_KEY = 'bd7582cda4ca10981af5faf68797d63b95271b5a';

// Chat ID для повідомлень
const CHAT_ID = '383265817';

// Отримання новин про Bitcoin
async function getBitcoinNews() {
  try {
    const response = await axios.get(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTOPANIC_API_KEY}&currencies=BTC&filter=important`
    );
    return response.data.results;
  } catch (error) {
    console.error('Помилка отримання новин:', error);
    return [];
  }
}

// Відправка новин у Telegram
async function sendNewsToTelegram(news) {
  for (const item of news) {
    const message = `📰 <b>${item.title}</b>\n\n${item.url}`;
    await bot.sendMessage(CHAT_ID, message, { parse_mode: 'HTML' });
  }
}

// Основна логіка перевірки новин
async function checkAndSendNews() {
  const news = await getBitcoinNews();
  if (news.length > 0) {
    await sendNewsToTelegram(news);
  } else {
    console.log('Нових важливих новин немає.');
  }
}

// Виконання перевірки кожні 30 хвилин
setInterval(checkAndSendNews, 30 * 60 * 1000);

// Команда для запуску бота
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Бот запущено та готовий до роботи.');
});
