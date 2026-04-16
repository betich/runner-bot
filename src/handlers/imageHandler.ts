import { MessageEvent, ImageMessage } from '@line/bot-sdk';
import { lineClient, lineBlobClient } from '../services/lineClient';
import { addKmEntry, getKmLeaderboard } from '../services/database';
import { extractTextFromImage, extractDistanceKm } from '../services/ocr';
import { getChatId, getChatName, getMemberDisplayName } from '../utils/chatHelpers';
import { pickRandom, KM_ADDED_MESSAGES } from '../messages/randomMessages';
import { buildKmLeaderboard } from '../messages/flexTemplates';
import { currentMonthLabel } from '../utils/dateHelpers';

async function streamToBuffer(readable: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readable.on('data', (chunk: Buffer) => chunks.push(chunk));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export async function imageHandler(
  event: MessageEvent & { message: ImageMessage }
): Promise<void> {
  const groupId = getChatId(event.source);
  const userId = event.source.userId ?? 'unknown';

  // Download the image from LINE content API
  const stream = await lineBlobClient.getMessageContent(event.message.id);
  const imageBuffer = await streamToBuffer(stream as unknown as NodeJS.ReadableStream);

  // Run OCR
  let ocrText: string;
  try {
    ocrText = await extractTextFromImage(imageBuffer);
  } catch (err) {
    console.error('OCR error:', err);
    return;
  }

  const km = extractDistanceKm(ocrText);
  if (!km) return;

  // Fetch user's display name for logging
  let userName = userId;
  try {
    userName = await getMemberDisplayName(event.source, userId);
  } catch {
    // userId as fallback — already set above
  }

  addKmEntry(groupId, userName, km, 'ocr', userId);

  const reply = pickRandom(KM_ADDED_MESSAGES)(userName, km);
  const monthLabel = currentMonthLabel();
  const groupName = await getChatName(event.source).catch(() => null);
  const leaderboardFlex = buildKmLeaderboard(getKmLeaderboard(groupId), monthLabel, groupName);

  await lineClient.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: 'text', text: reply }, leaderboardFlex],
  });
}
