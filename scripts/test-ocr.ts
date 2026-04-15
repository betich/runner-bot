import { readFileSync } from 'fs';
import { initOcrWorker, extractTextFromImage, terminateOcrWorker } from '../src/services/ocr';
import { extractDistanceKm } from '../src/services/ocr';

const imagePath = process.argv[2];
if (!imagePath) {
  console.error('Usage: bun scripts/test-ocr.ts <image-path>');
  process.exit(1);
}

const imageBuffer = readFileSync(imagePath);

await initOcrWorker();
const text = await extractTextFromImage(imageBuffer);
await terminateOcrWorker();

console.log('--- OCR raw text ---');
console.log(text);
console.log('--- Extracted distance ---');
const km = extractDistanceKm(text);
if (km !== null) {
  console.log(`${km} km`);
} else {
  console.log('No distance found');
}
