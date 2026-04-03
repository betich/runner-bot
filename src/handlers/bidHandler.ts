import { MessageEvent, TextMessage } from '@line/bot-sdk';
import { addBidEntry, removeBidEntry } from '../services/database';
import { getChatId, getMemberDisplayName } from '../utils/chatHelpers';
import { lineClient } from '../services/lineClient';
import { pickRandom, BID_ADDED_MESSAGES } from '../messages/randomMessages';

const UNBID_PATTERN = /unบิด/;
const BID_PATTERN = /บิด/;

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

export async function bidHandler(
  event: MessageEvent & { message: TextMessage }
): Promise<void> {
  const groupId = getChatId(event.source);
  const text = event.message.text;
  const profiles = await resolveMentionees(event);
  if (profiles.length === 0) return;

  if (UNBID_PATTERN.test(text)) {
    // Undo the most recent bid for each mentioned person
    const results = profiles.map((p) => ({
      name: p.displayName,
      removed: removeBidEntry(groupId, p.userId),
    }));

    const firstName = results[0].name;
    const reply = results[0].removed
      ? `โอเค ลบแต้มนักบิดของ ${firstName} ออก 1 แต้ม ✅`
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
