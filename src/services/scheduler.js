import cron from 'node-cron';
import fetchFixtures from './api.js';

// Schedule a task to fetch fixtures every day at 06:00 UTC
cron.schedule('0 6 * * *', async () => {
    console.log('Running scheduled task to fetch fixtures at 06:00 UTC');
    await fetchFixtures();
}, {
    timezone: "UTC"
});