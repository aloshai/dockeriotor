export const config = () => ({
  discordBotApiKey: process.env.DISCORD_BOT_API_KEY || 'discord-bot-api-key',
  telegramBotApiKey: process.env.TELEGRAM_BOT_API_KEY || 'telegram-bot-api-key',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || 'telegram-bot-token',

  auth: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || '1228183759183020096',
      clientSecret:
        process.env.DISCORD_CLIENT_SECRET || 'ag_hn0igBHSUA6ssUGZGBegNStOqMZRV',
      redirectUri:
        process.env.DISCORD_REDIRECT_URI ||
        'http://localhost:5173/discord/callback',
    },

    jwtSecret: process.env.JWT_SECRET || 'jwt-secret',
  },

  redis: process.env.REDIS_URL || 'redis://localhost:6379',
});
