import { WebhookEvent, MessageEvent, TextMessage, ImageMessage } from '@line/bot-sdk';
import { kmHandler } from './handlers/kmHandler';
import { bidHandler, selfBidHandler } from './handlers/bidHandler';
import { leaderboardHandler } from './handlers/leaderboardHandler';
import { imageHandler } from './handlers/imageHandler';
import { helpHandler } from './handlers/helpHandler';

const KM_PATTERN = /^(?:(.+?)\s*)?\+(\d+(?:[.,]\d+)?)\s*(?:km|กม\.?)?$/i;
const LEADERBOARD_KM_PATTERN = /^(\/km|วิ่ง|leaderboard)$/i;
const LEADERBOARD_BID_PATTERN = /^(\/บิด|นักบิด)$/i;
const LEADERBOARD_BID_ALLTIME_PATTERN = /^(\/นักบิดตัวยง|นักบิดตัวยง)$/i;
const BID_PATTERN = /บิด|unบิด/;
const SELF_BID_PATTERN = /^ผมบิด|^หนูบิด|^ฉันบิด|^unบิดผม|^unบิดหนู|^unบิดฉัน/;
const HELP_PATTERN = /^ช่วยด้วย$/;

export async function handleEvent(event: WebhookEvent): Promise<void> {
  console.log(`[event] type=${event.type} source=${event.source.type}`, JSON.stringify(event, null, 2));

  if (event.source.type !== 'group' && event.source.type !== 'room') return;

  if (event.type === 'message') {
    const msg = event.message;

    if (msg.type === 'text') {
      await handleTextMessage(event as MessageEvent & { message: TextMessage });
    } else if (msg.type === 'image') {
      await imageHandler(event as MessageEvent & { message: ImageMessage });
    }
  }
}

async function handleTextMessage(
  event: MessageEvent & { message: TextMessage }
): Promise<void> {
  const text = event.message.text.trim();
  const mentionees = event.message.mention?.mentionees ?? [];
  const hasMentions = mentionees.length > 0;

  console.log(`[text] "${text}" mentions=${mentionees.length} user=${event.source.userId}`);

  if (HELP_PATTERN.test(text)) {
    await helpHandler(event);
    return;
  }

  // Priority 1a: self-bid (no mention needed)
  if (SELF_BID_PATTERN.test(text)) {
    await selfBidHandler(event);
    return;
  }

  // Priority 1b: bid (requires @mention + บิด keyword)
  if (hasMentions && BID_PATTERN.test(text)) {
    await bidHandler(event);
    return;
  }

  // Priority 2: km text logging
  if (KM_PATTERN.test(text)) {
    await kmHandler(event);
    return;
  }

  // Priority 3: leaderboard commands
  if (LEADERBOARD_KM_PATTERN.test(text)) {
    await leaderboardHandler(event, 'km');
    return;
  }

  if (LEADERBOARD_BID_PATTERN.test(text)) {
    await leaderboardHandler(event, 'bid');
    return;
  }

  if (LEADERBOARD_BID_ALLTIME_PATTERN.test(text)) {
    await leaderboardHandler(event, 'bid-alltime');
    return;
  }
}
