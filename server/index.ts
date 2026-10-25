import { app } from './app';
import { config } from './config';
import { runCollection } from './services/collector';

// Start HTTP server for local development
app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`[The Daily Brief] Backend server running on port ${config.port}`);
  console.log(`[The Daily Brief] Public API: http://localhost:${config.port}/api/articles`);
  console.log(`[The Daily Brief] Admin API:  http://localhost:${config.port}/api/admin`);
  console.log(`====================================================`);
});

// Automated scheduled collection runner for long-running local development process
if (config.autoCollectMinutes > 0) {
  const intervalMs = config.autoCollectMinutes * 60 * 1000;
  console.log(`[Scheduler] Auto-collection scheduled every ${config.autoCollectMinutes} minutes`);

  setInterval(async () => {
    try {
      console.log(`[Scheduler] Running scheduled background collection...`);
      const summary = await runCollection();
      console.log(`[Scheduler] Completed collection: ${summary.itemsSaved} new saved, ${summary.itemsDuplicate} duplicates.`);
    } catch (err: any) {
      console.error(`[Scheduler] Background collection error:`, err.message);
    }
  }, intervalMs);
}

export default app;
