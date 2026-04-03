import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const config = {
  channelAccessToken: required('LINE_CHANNEL_ACCESS_TOKEN'),
  channelSecret: required('LINE_CHANNEL_SECRET'),
  port: parseInt(process.env.PORT ?? '3000', 10),
  dbPath: process.env.DB_PATH ?? './data/bot.db',
};
