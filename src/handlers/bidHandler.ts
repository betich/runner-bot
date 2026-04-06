import { MessageEvent, TextMessage } from '@line/bot-sdk';
import { addBidEntry, removeBidEntry, getBidCount } from '../services/database';
import { getChatId, getMemberDisplayName } from '../utils/chatHelpers';
import { lineClient } from '../services/lineClient';
import { pickRandom, BID_SELF_MESSAGES, BID_REPORTED_MESSAGES } from '../messages/randomMessages';

const UNBID_PATTERN = /unบิด/;
const BID_PATTERN = /(?:^|\s)บิด(?:คับ)?(?:\s|$)/;
const SELF_BID_PATTERN = /^(?:ผม|หนู|ฉัน)บิด(?:คับ)?(?:\s|$)/;
const SELF_UNBID_PATTERN = /^unบิด(?:ผม|หนู|ฉัน)/;

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
    const reasonMatch = text.match(/บิด(?:คับ)?\s+(.+)$/);
    const reason = reasonMatch?.[1]?.trim();
    addBidEntry(groupId, displayName, userId, userId);
    const count = getBidCount(groupId, userId);
    const reply = pickRandom(BID_SELF_MESSAGES)(displayName, count, reason);
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
    const reasonMatch = text.match(/บิด(?:คับ)?\s+(?!@)(.+)$/);
    const reason = reasonMatch?.[1]?.trim();
    for (const profile of profiles) {
      addBidEntry(groupId, profile.displayName, profile.userId, reporterId);
    }

    const firstProfile = profiles[0];
    const count = getBidCount(groupId, firstProfile.userId);
    const reply = pickRandom(BID_REPORTED_MESSAGES)(firstProfile.displayName, count, reason);

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: reply }],
    });
  }
}
