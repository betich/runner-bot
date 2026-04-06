import { MessageEvent, TextMessage } from '@line/bot-sdk';
import { addBidEntry, removeBidEntry } from '../services/database';
import { getChatId, getMemberDisplayName } from '../utils/chatHelpers';
import { lineClient } from '../services/lineClient';
import { pickRandom, BID_ADDED_MESSAGES } from '../messages/randomMessages';

const UNBID_PATTERN = /unบิด/;
const BID_PATTERN = /บิด/;
const SELF_BID_PATTERN = /^ผมบิด|^หนูบิด|^ฉันบิด/;
const SELF_UNBID_PATTERN = /^unบิดผม|^unบิดหนู|^unบิดฉัน/;

async function resolveMentionees(
  event: MessageEvent & { message: TextMessage }
) {
  const mentionees = event.message.mention?.mentionees ?? [];
  return Promise.all(
    mentionees
      .filter((m) => m.type === 'user')
      .map(async (m) => {
        const userId = m.userId ?? 'unknown';
        try {
          const displayName = await getMemberDisplayName(event.source, userId);
          return { userId, displayName };
        } catch {
          const nameInMessage = event.message.text.substring(m.index, m.index + m.length);
          return { userId, displayName: nameInMessage };
        }
      })
  );
}

export async function selfBidHandler(
  event: MessageEvent & { message: TextMessage }
): Promise<void> {
  const groupId = getChatId(event.source);
  const userId = event.source.userId ?? 'unknown';
  const text = event.message.text;

  if (SELF_UNBID_PATTERN.test(text)) {
    const countMatch = text.match(/unบิด\S*\s+(\d+)/);
    const count = countMatch ? parseInt(countMatch[1], 10) : 1;
    const removed = removeBidEntry(groupId, userId, count);
    const reply = removed > 0
      ? `โอเค ลบแต้มนักบิดของตัวเองออก ${removed} แต้ม ✅`
      : `ไม่มีแต้มนักบิดของตัวเองเดือนนี้อยู่แล้วนะ 🤔`;
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }],
    });
  } else if (SELF_BID_PATTERN.test(text)) {
    let displayName: string;
    try {
      displayName = await getMemberDisplayName(event.source, userId);
    } catch {
      displayName = userId;
    }
    addBidEntry(groupId, displayName, userId, userId);
    const reply = pickRandom(BID_ADDED_MESSAGES)(displayName);
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }],
    });
  }
}

export async function bidHandler(
  event: MessageEvent & { message: TextMessage }
): Promise<void> {
  const groupId = getChatId(event.source);
  const text = event.message.text;
  const profiles = await resolveMentionees(event);
  if (profiles.length === 0) return;

  if (UNBID_PATTERN.test(text)) {
    const countMatch = text.match(/unบิด\S*\s+(\d+)/);
    const count = countMatch ? parseInt(countMatch[1], 10) : 1;

    const results = profiles.map((p) => ({
      name: p.displayName,
      removed: removeBidEntry(groupId, p.userId, count),
    }));

    const firstName = results[0].name;
    const removed = results[0].removed;
    const reply = removed > 0
      ? `โอเค ลบแต้มนักบิดของ ${firstName} ออก ${removed} แต้ม ✅`
      : `${firstName} ไม่มีแต้มนักบิดเดือนนี้อยู่แล้วนะ 🤔`;

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }],
    });
  } else if (BID_PATTERN.test(text)) {
    const reporterId = event.source.userId ?? 'unknown';
    for (const profile of profiles) {
      addBidEntry(groupId, profile.displayName, profile.userId, reporterId);
    }

    const firstName = profiles[0].displayName;
    const reply = pickRandom(BID_ADDED_MESSAGES)(firstName);

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }],
    });
  }
}
