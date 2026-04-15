import { MessageEvent, TextMessage } from '@line/bot-sdk';
import { addKmEntry, getKmLeaderboard } from '../services/database';
import { parseDistance } from '../utils/parseDistance';
import { getChatId, getChatName, getMemberDisplayName } from '../utils/chatHelpers';
import { lineClient } from '../services/lineClient';
import { pickRandom, KM_ADDED_MESSAGES } from '../messages/randomMessages';
import { buildKmLeaderboard } from '../messages/flexTemplates';
import { currentMonthLabel } from '../utils/dateHelpers';

const KM_PATTERN = /^(?:(.+?)\s*)?\+(\d+(?:[.,]\d+)?)\s*(?:km|กม\.?)?$/i;

export async function kmHandler(
  event: MessageEvent & { message: TextMessage }
): Promise<void> {
  const groupId = getChatId(event.source);
  const text = event.message.text.trim();
  const match = text.match(KM_PATTERN);
  if (!match) return;

  const km = parseDistance(match[2]);
  if (!km) return;

  let name = match[1]?.trim();

  if (!name) {
    // Self-log: resolve sender's display name from LINE profile
    const userId = event.source.userId;
    if (!userId) return;
    try {
      name = await getMemberDisplayName(event.source, userId);
    } catch {
      name = userId;
    }
    addKmEntry(groupId, name, km, 'text', userId);
  } else if (name.startsWith('@')) {
    // @mention: resolve display name via mentionee userId
    const mentionees = event.message.mention?.mentionees ?? [];
    const matched = mentionees.find(
      (m) => text.substring(m.index, m.index + m.length) === name
    );
    if (matched && matched.type === 'user' && matched.userId) {
      try {
        name = await getMemberDisplayName(event.source, matched.userId);
      } catch {
        name = name.replace(/^@/, '');
      }
      addKmEntry(groupId, name, km, 'text', matched.userId);
    } else {
      name = name.replace(/^@/, '');
      addKmEntry(groupId, name, km, 'text');
    }
  } else {
    addKmEntry(groupId, name, km, 'text');
  }

  const reply = pickRandom(KM_ADDED_MESSAGES)(name, km);
  const monthLabel = currentMonthLabel();
  const groupName = await getChatName(event.source).catch(() => null);
  const leaderboardFlex = buildKmLeaderboard(getKmLeaderboard(groupId), monthLabel, groupName);

  await lineClient.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: 'text', text: reply }, leaderboardFlex],
  });
}
