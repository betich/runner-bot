import express, { Request, Response, NextFunction } from 'express';
import { WebhookEvent } from '@line/bot-sdk';
import { config } from './config';
import { lineMiddleware } from './services/lineClient';
import { handleEvent } from './webhook';
import { initOcrWorker, terminateOcrWorker } from './services/ocr';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Log + forward any errors thrown by lineMiddleware (e.g. bad signature)
function webhookMiddleware(req: Request, res: Response, next: NextFunction) {
  lineMiddleware(req, res, (err?: unknown) => {
    if (err) {
      console.error('[middleware error]', err);
      res.status(400).json({ error: 'Bad request' });
      return;
    }
    next();
  });
}

app.post('/webhook', webhookMiddleware, (req, res) => {
  const events: WebhookEvent[] = req.body.events;
  console.log(`[webhook] received ${events.length} event(s)`);

  Promise.all(events.map(handleEvent))
    .then(() => res.json({ status: 'ok' }))
    .catch((err) => {
      console.error('[webhook error]', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Catch-all error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[unhandled error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function main() {
  // Start listening immediately — OCR init happens in the background
  app.listen(config.port, () => {
    console.log(`LINE Runner Bot listening on port ${config.port}`);
  });

  // Init OCR after server is up so startup failures don't kill the bot
  initOcrWorker()
    .then(() => console.log('[ocr] worker ready'))
    .catch((err) => console.error('[ocr] worker failed to initialize — image OCR disabled:', err));

  process.on('SIGTERM', async () => {
    await terminateOcrWorker();
    process.exit(0);
  });
}

main().catch(console.error);
