require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// 機器人準備完成
client.once('ready', () => {
  console.log(`✅ 機器人已登入，用戶名：${client.user.tag}`);
  console.log(`📊 機器人正在服務 ${client.guilds.cache.size} 個伺服器`);
});

// 監聽訊息
client.on('messageCreate', (message) => {
  // 忽略機器人訊息
  if (message.author.bot) return;

  // 忽略非文字頻道的訊息
  if (!message.guild) return;

  // 基本命令
  if (message.content === '!ping') {
    message.reply('🏓 Pong!');
  }

  if (message.content === '!help') {
    message.reply(`
📚 **可用命令**
\`!ping\` - 檢查機器人是否在線
\`!help\` - 顯示這個訊息
    `);
  }

  if (message.content === '!anime') {
    message.reply('🎌 歡迎來到動漫機器人！');
  }
});

// 錯誤處理
client.on('error', (error) => {
  console.error('❌ Discord 客戶端錯誤:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未處理的 Promise 拒絕:', reason);
});

// 登入機器人
client.login(process.env.DISCORD_TOKEN);
