import { MessageEvent } from '@line/bot-sdk';
import { lineClient } from '../services/lineClient';
import { getKmLeaderboard, getBidLeaderboard, getBidLeaderboardAllTime } from '../services/database';
import { buildKmLeaderboard, buildBidLeaderboard, buildBidLeaderboardAllTime } from '../messages/flexTemplates';
import { getChatId, getChatName } from '../utils/chatHelpers';
import {
  pickRandom,
  LEADERBOARD_INTRO_MESSAGES,
  BID_LEADERBOARD_INTRO_MESSAGES,
} from '../messages/randomMessages';
import { currentMonthLabel } from '../utils/dateHelpers';

export async function leaderboardHandler(
  event: MessageEvent,
  type: 'km' | 'bid' | 'bid-alltime'
): Promise<void> {
  const groupId = getChatId(event.source);
  const monthLabel = currentMonthLabel();
  const groupName = await getChatName(event.source).catch(() => null);

  if (type === 'km') {
    const entries = getKmLeaderboard(groupId);
    const intro = pickRandom(LEADERBOARD_INTRO_MESSAGES)();
    const flex = buildKmLeaderboard(entries, monthLabel, groupName);

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: intro }, flex],
    });
  } else if (type === 'bid') {
    const entries = getBidLeaderboard(groupId);
    const intro = pickRandom(BID_LEADERBOARD_INTRO_MESSAGES)();
    const flex = buildBidLeaderboard(entries, monthLabel, groupName);

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: intro }, flex],
    });
  } else {
    const entries = getBidLeaderboardAllTime(groupId);
    const flex = buildBidLeaderboardAllTime(entries, groupName);

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: '🏛️ ฮอลล์ออฟเฟมนักบิดตลอดกาล!' }, flex],
    });
  }
}
