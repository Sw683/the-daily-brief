import { Router, Request, Response } from 'express';
import { runCollection, isCollectionRunning } from '../services/collector';
import { config } from '../config';

export const cronRouter = Router();

/**
 * Handler for automated cron triggers (supports both GET from Vercel Cron and POST from external schedulers)
 */
async function handleCronCollect(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-cron-secret'];
  
  let providedSecret = '';
  if (typeof customHeader === 'string' && customHeader) {
    providedSecret = customHeader;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    providedSecret = authHeader.split(' ')[1];
  }

  // Validate cron secret
  if (!providedSecret || providedSecret !== config.cronSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid cron authorization secret' });
    return;
  }

  // Idempotency: Prevent concurrent overlapping executions
  if (isCollectionRunning()) {
    res.status(200).json({
      success: true,
      status: 'skipped',
      message: 'Collection job already executing, safely skipped overlap',
    });
    return;
  }

  try {
    const summary = await runCollection();
    res.json({
      success: true,
      status: 'completed',
      summary,
    });
  } catch (err: any) {
    console.error('[Cron Engine] Scheduled collection failed:', err);
    res.status(500).json({ error: 'Scheduled collection encountered an error', details: err.message });
  }
}

// Vercel Cron sends GET requests by default
cronRouter.get('/collect', handleCronCollect);

// External schedulers / webhooks often send POST
cronRouter.post('/collect', handleCronCollect);
