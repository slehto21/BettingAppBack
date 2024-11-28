import express from 'express';
import { getCachedData } from '../services/cache.js';
import fetchFixtures from '../services/api.js';

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const fixtures = await getCachedData('fixtures');
        response.send(fixtures);
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        response.status(500).send('Error fetching fixtures');
    }
});

router.get('/test', (request, response) => {
    fetchFixtures();
    response.send('Fetching fixtures');
});
    

export default router;