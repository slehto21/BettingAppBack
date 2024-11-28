import axios from 'axios';
import dotenv from 'dotenv';
import { cacheData } from './cache.js';
import { db } from '../config/firebaseConfig.js';

dotenv.config();

const batch = db.batch();

const apiConfig = {
    baseUrl: "https://api.the-odds-api.com/v4",
    endUrl: `odds/?apiKey=${process.env.ODDS_API_KEY}&regions=eu&commenceTimeFrom=${new Date(new Date().setUTCHours(6, 0, 0, 0)).toISOString().split('.')[0] + 'Z'}&commenceTimeTo=${new Date(new Date().setUTCHours(6, 0, 0, 0) + 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z'}&includeLinks=true`,
    apiKey: process.env.ODDS_API_KEY,
    commenceTimeFrom: new Date(new Date().setUTCHours(6, 0, 0, 0)).toISOString().split('.')[0] + 'Z',
    commenceTimeTo: new Date(new Date().setUTCHours(6, 0, 0, 0) + 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z'
}

const apiLinks = {
    icehockey: `${apiConfig.baseUrl}/sports/icehockey/${apiConfig.endUrl}`,
    soccer: `${apiConfig.baseUrl}/sports/soccer/${apiConfig.endUrl}`,
    basketball: `${apiConfig.baseUrl}/sports/basketball/${apiConfig.endUrl}`,
    americanfootball: `${apiConfig.baseUrl}/sports/americanfootball/${apiConfig.endUrl}`,
}

const requests = [
    axios.get(apiLinks.icehockey),
    axios.get(apiLinks.soccer),
    axios.get(apiLinks.basketball),
    axios.get(apiLinks.americanfootball),
]

export default async function fetchFixtures() {
    try {
        const results = await Promise.allSettled(requests);
        const fixtures = [];
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                const sportFixtures = processFixtures(result.value.data);
                fixtures.push(sportFixtures);
            } else {
                console.error('Error fetching fixtures: ', result.reason);
            }
        });
        await cacheData('fixtures', fixtures);
        await deleteFixturesFromDb(); // Delete old fixtures from db
        await setFixturesToBatch(fixtures);
        await commitFixtureBatch();
    } catch (e) {
        console.error('Error fetching fixtures: ', e);
    }
};

// Create an object with sport as key
const processFixtures = (data) => {
    const fixtures = {};

    data.forEach((fixture) => {
        const sport = fixture.sport_key.includes('_') ? fixture.sport_key.split('_')[0] : fixture.sport_key;
        const league = fixture.sport_title;
        const homeTeam = fixture.home_team;
        const awayTeam = fixture.away_team;
        const commenceTime = fixture.commence_time;

        const bookmakers = fixture.bookmakers.map(bookmaker => ({
            name: bookmaker.title,
            updated: bookmaker.last_update,
            link: bookmaker.link,
            markets: bookmaker.markets.map(market => ({
                name: market.key,
                updated: market.last_update,
                outcomes: market.outcomes.map(outcome => ({
                    name: outcome.name,
                    odds: outcome.price
                }))
            }))
        }));

        if (!fixtures[sport]) {
            fixtures[sport] = [];
        }

        fixtures[sport].push({
            sport,
            league,
            homeTeam,
            awayTeam,
            commenceTime,
            bookmakers
        });
    });

    return fixtures;
};


const setFixturesToBatch = async (fixtures) => {
    try {
        fixtures.forEach((sportFixtures) => {
            Object.keys(sportFixtures).forEach((sport) => {
                sportFixtures[sport].forEach((fixture) => {
                    const fixtureRef = db.collection('fixtures').doc();
                    batch.set(fixtureRef, fixture);
                });
            });
        });
    } catch (e) {
        console.error('Error creating fixture batch: ', e);
    }
}

const commitFixtureBatch = async () => {
    try {
        await batch.commit();
    } catch (e) {
        console.error('Error saving fixtures to db: ', e);
    }
}

const deleteFixturesFromDb = async () => {
    try {
        const fixturesQuery = db.collection('fixtures');
        const fixturesSnapshot = await fixturesQuery.get();
        fixturesSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
    } catch (e) {
        console.error('Error deleting fixtures from db: ', e);
    }
}