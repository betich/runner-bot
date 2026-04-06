import Tesseract, { Worker } from 'tesseract.js';
import { parseDistance } from '../utils/parseDistance';

let worker: Worker | null = null;

export async function initOcrWorker(): Promise<void> {
  worker = await Tesseract.createWorker(['eng', 'tha'], 1, {
    logger: () => {},
  });
}

export async function terminateOcrWorker(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  if (!worker) throw new Error('OCR worker not initialized');
  const { data } = await worker.recognize(imageBuffer);
  return data.text;
}

/**
 * Attempts to extract a running distance (km) from OCR text.
 * Uses three strategies in order of confidence.
 * Returns null if no unambiguous distance can be found.
 */
export function extractDistanceKm(ocrText: string): number | null {
  const lines = ocrText.split('\n').map((l) => l.trim()).filter(Boolean);

  // Matches: km, กม, กม., ก.ม., ก.ม (with optional trailing dot)
  const KM_UNIT = /(?:km|ก\.?ม\.?)/i;

  // Strategy 1: number immediately followed by km/กม on the same line
  const inlinePattern = new RegExp(`(\\d+[.,]\\d+|\\d+)\\s*${KM_UNIT.source}`, 'i');
  for (const line of lines) {
    const match = line.match(inlinePattern);
    if (match) {
      const km = parseDistance(match[1]);
      if (km) return km;
    }
  }

  // Strategy 2: "km" or "กม" label on its own line, with a number on adjacent line
  for (let i = 0; i < lines.length; i++) {
    if (new RegExp(`^${KM_UNIT.source}$`, 'i').test(lines[i])) {
      for (const adjacent of [lines[i - 1], lines[i + 1]]) {
        if (!adjacent) continue;
        const numMatch = adjacent.match(/^(\d+[.,]\d+|\d+)$/);
        if (numMatch) {
          const km = parseDistance(numMatch[1]);
          if (km) return km;
        }
      }
    }
  }

  // Strategy 3: only one plausible running distance in the entire text
  const allMatches = [...ocrText.matchAll(/(\d+[.,]\d+|\d+)/g)]
    .map((m) => parseDistance(m[1]))
    .filter((n): n is number => n !== null);

  if (allMatches.length === 1) return allMatches[0];

  return null;
}
