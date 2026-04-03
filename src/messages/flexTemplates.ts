import { messagingApi } from '@line/bot-sdk';
type FlexMessage = messagingApi.FlexMessage;
type FlexBubble = messagingApi.FlexBubble;
type FlexComponent = messagingApi.FlexComponent;
import { KmLeaderboardRow, BidLeaderboardRow } from '../services/database';

const MEDALS = ['🥇', '🥈', '🥉'];

function rankLabel(i: number): string {
  return MEDALS[i] ?? `${i + 1}.`;
}

function leaderboardRow(
  rank: number,
  name: string,
  rightText: string,
  subText?: string
): FlexComponent {
  const isTop = rank < 3;
  return {
    type: 'box',
    layout: 'horizontal',
    contents: [
      {
        type: 'text',
        text: rankLabel(rank),
        size: 'sm',
        flex: 1,
        gravity: 'center',
      },
      {
        type: 'box',
        layout: 'vertical',
        flex: 5,
        contents: [
          {
            type: 'text',
            text: name,
            size: 'sm',
            weight: isTop ? 'bold' : 'regular',
            color: '#111111',
          },
          ...(subText
            ? [{ type: 'text' as const, text: subText, size: 'xxs' as const, color: '#AAAAAA' }]
            : []),
        ],
      },
      {
        type: 'text',
        text: rightText,
        size: 'sm',
        flex: 3,
        align: 'end',
        gravity: 'center',
        weight: isTop ? 'bold' : 'regular',
        color: isTop ? '#00B900' : '#444444',
      },
    ],
    paddingTop: '8px',
  };
}

export function buildKmLeaderboard(
  entries: KmLeaderboardRow[],
  monthLabel: string,
  groupName?: string | null
): FlexMessage {
  const rows: FlexComponent[] = entries.length > 0
    ? entries.map((e, i) =>
        leaderboardRow(i, e.user_name, `${e.total_km} km`, `${e.runs} runs`)
      )
    : [{ type: 'text', text: 'ยังไม่มีใครวิ่งเดือนนี้เลย! 😴', color: '#AAAAAA', size: 'sm' }];

  const bubble: FlexBubble = {
    type: 'bubble',
    size: 'kilo',
    header: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#00B900',
      paddingAll: '16px',
      contents: [
        { type: 'text', text: '🏃 KM Leaderboard', weight: 'bold', color: '#FFFFFF', size: 'lg' },
        { type: 'text', text: groupName ? `${groupName} · ${monthLabel}` : monthLabel, color: '#CCFFCC', size: 'sm' },
      ],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '16px',
      spacing: 'none',
      contents: rows,
    },
  };

  return {
    type: 'flex',
    altText: `KM Leaderboard — ${groupName ?? monthLabel}`,
    contents: bubble,
  };
}

export function buildBidLeaderboard(
  entries: BidLeaderboardRow[],
  monthLabel: string,
  groupName?: string | null
): FlexMessage {
  const rows: FlexComponent[] = entries.length > 0
    ? entries.map((e, i) =>
        leaderboardRow(i, e.target_name, `${e.bid_count} บิด`)
      )
    : [{ type: 'text', text: 'ยังไม่มีนักบิดเดือนนี้! 🎉', color: '#AAAAAA', size: 'sm' }];

  const bubble: FlexBubble = {
    type: 'bubble',
    size: 'kilo',
    header: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#FF6B35',
      paddingAll: '16px',
      contents: [
        { type: 'text', text: '🛵 ยอดนักบิด', weight: 'bold', color: '#FFFFFF', size: 'lg' },
        { type: 'text', text: groupName ? `${groupName} · ${monthLabel}` : monthLabel, color: '#FFE0D0', size: 'sm' },
      ],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '16px',
      spacing: 'none',
      contents: rows,
    },
  };

  return {
    type: 'flex',
    altText: `ยอดนักบิด — ${groupName ?? monthLabel}`,
    contents: bubble,
  };
}

export function buildBidLeaderboardAllTime(
  entries: BidLeaderboardRow[],
  groupName?: string | null
): FlexMessage {
  const rows: FlexComponent[] = entries.length > 0
    ? entries.map((e, i) =>
        leaderboardRow(i, e.target_name, `${e.bid_count} บิด`)
      )
    : [{ type: 'text', text: 'ยังไม่มีประวัตินักบิดเลย! 🎉', color: '#AAAAAA', size: 'sm' }];

  const subtitle = groupName ? `${groupName} · ตลอดกาล` : 'ตลอดกาล';

  const bubble: FlexBubble = {
    type: 'bubble',
    size: 'kilo',
    header: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#8B0000',
      paddingAll: '16px',
      contents: [
        { type: 'text', text: '🏛️ นักบิดตัวยง', weight: 'bold', color: '#FFFFFF', size: 'lg' },
        { type: 'text', text: subtitle, color: '#FFAAAA', size: 'sm' },
      ],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '16px',
      spacing: 'none',
      contents: rows,
    },
  };

  return {
    type: 'flex',
    altText: `นักบิดตัวยง — ${groupName ?? 'All Time'}`,
    contents: bubble,
  };
}
