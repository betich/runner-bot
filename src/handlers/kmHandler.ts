import { MessageEvent, TextMessage } from '@line/bot-sdk';
import { lineClient } from '../services/lineClient';
import { addKmEntry } from '../services/database';
import { parseDistance } from '../utils/parseDistance';
import { getChatId } from '../utils/chatHelpers';
import { pickRandom, KM_ADDED_MESSAGES } from '../messages/randomMessages';

const KM_PATTERN = /^(.+?)\s*\+(\d+(?:[.,]\d+)?)\s*(?:km|กม\.?)?$/i;

export async function kmHandler(
  event: MessageEvent & { message: TextMessage }
): Promise<void> {
  const groupId = getChatId(event.source);
  const text = event.message.text.trim();
  const match = text.match(KM_PATTERN);
  if (!match) return;

  const name = match[1].trim();
  const km = parseDistance(match[2]);
  if (!km) return;

  addKmEntry(groupId, name, km, 'text');

  const reply = pickRandom(KM_ADDED_MESSAGES)(name, km);
  await lineClient.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: 'text', text: reply }],
  });
}
