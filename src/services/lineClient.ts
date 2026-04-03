import { messagingApi, middleware } from '@line/bot-sdk';
import { config } from '../config';

export const lineClient = new messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken,
});

export const lineMiddleware = middleware({
  channelSecret: config.channelSecret,
});

export const lineBlobClient = new messagingApi.MessagingApiBlobClient({
  channelAccessToken: config.channelAccessToken,
});
