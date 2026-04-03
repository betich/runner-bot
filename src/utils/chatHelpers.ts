import { EventSource } from '@line/bot-sdk';
import { lineClient } from '../services/lineClient';

/** Returns the group or room ID used for DB scoping. */
export function getChatId(source: EventSource): string {
  if (source.type === 'group') return source.groupId;
  if (source.type === 'room') return source.roomId;
  throw new Error('getChatId called on non-group/room source');
}

/** Fetches the group/room name. Returns null for rooms (no summary API). */
export async function getChatName(source: EventSource): Promise<string | null> {
  if (source.type === 'group') {
    const summary = await lineClient.getGroupSummary(source.groupId);
    return summary.groupName;
  }
  return null;
}

/** Fetches a member's display name using the correct API for groups vs rooms. */
export async function getMemberDisplayName(
  source: EventSource,
  userId: string
): Promise<string> {
  if (source.type === 'group') {
    const profile = await lineClient.getGroupMemberProfile(source.groupId, userId);
    return profile.displayName;
  }
  if (source.type === 'room') {
    const profile = await lineClient.getRoomMemberProfile(source.roomId, userId);
    return profile.displayName;
  }
  throw new Error('getMemberDisplayName called on non-group/room source');
}
