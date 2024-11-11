import axios from 'axios';
import dotenv from 'dotenv';
import { cacheData } from './cache.js';
import { db } from '../config/firebaseConfig.js';

dotenv.config();

const testFixturesSoccer = [
    {
        "id": "5bd6694122e5f9b1f6668dcf5ff00b5f",
        "sport_key": "soccer_australia_aleague",
        "sport_title": "J-League",
        "commence_time": "2024-11-10T05:00:00Z",
        "home_team": "Central Coast Airline",
        "away_team": "Wellington Phoenix FC",
        "bookmakers": [
            {
                "key": "sport888",
                "title": "888sport",
                "last_update": "2024-11-10T06:27:52Z",
                "link": "https://www.888sport.com/football/australia/australia-a-league/central-coast-mariners-v-wellington-phoenix-e-4879845/",
                "markets": [
                    {
                        "key": "h2h",
                        "last_update": "2024-11-10T06:27:52Z",
                        "link": null,
                        "outcomes": [
                            {
                                "name": "Central Coast Mariners",
                                "price": 251.0,
                                "link": null
                            },
                            {
                                "name": "Wellington Phoenix FC",
                                "price": 1.0,
                                "link": null
                            },
                            {
                                "name": "Draw",
                                "price": 67.0,
                                "link": null
                            }
                        ]
                    }
                ]
            },
            {
                "key": "betclic",
                "title": "Betclic",
                "last_update": "2024-11-10T06:27:03Z",
                "link": "https://www.betclic.fr/football-s1/australie-a-league-c1874/central-coast-mariners-wellington-phoenix-m3002640758",
                "markets": [
                    {
                        "key": "h2h",
                        "last_update": "2024-11-10T06:27:03Z",
                        "link": null,
                        "outcomes": [
                            {
                                "name": "Central Coast Mariners",
                                "price": 100.0,
                                "link": null
                            },
                            {
                                "name": "Wellington Phoenix FC",
                                "price": 1.0,
                                "link": null
                            },
                            {
                                "name": "Draw",
                                "price": 55.0,
                                "link": null
                            }
                        ]
                    }
                ]
            },
            {
                "key": "nordicbet",
                "title": "Nordic Bet",
                "last_update": "2024-11-10T06:27:52Z",
                "link": "https://www.nordicbet.com/en/sportsbook/football/australia/australia-a-league/central-coast-mariners-wellington-phoenix-fc",
                "markets": [
                    {
                        "key": "h2h",
                        "last_update": "2024-11-10T06:27:52Z",
                        "link": null,
                        "outcomes": [
                            {
                                "name": "Central Coast Mariners",
                                "price": 46.0,
                                "link": null
                            },
                            {
                                "name": "Wellington Phoenix FC",
                                "price": 1.0,
                                "link": null
                            },
                            {
                                "name": "Draw",
                                "price": 23.0,
                                "link": null
                            }
                        ]
                    }
                ]
            },
        ]
    }
]

const testFixturesIceHockey = [
    {
        "id": "5bd6694122e5f9b1f6668dcf5ff00b5f",
        "sport_key": "icehockey_nhl",
        "sport_title": "NHL",
        "commence_time": "2024-11-10T05:00:00Z",
        "home_team": "Buffalo Sabres",
        "away_team": "Calgary Flames",
        "bookmakers": [
            {
                "key": "sport888",
                "title": "888sport",
                "last_update": "2024-11-10T06:27:52Z",
                "link": "https://www.888sport.com/icehockey/nhl/buffalo-sabres-v-calgary-flames-e-4879845/",
                "markets": [
                    {
                        "key": "h2h",
                        "last_update": "2024-11-10T06:27:52Z",
                        "link": null,
                        "outcomes": [
                            {
                                "name": "Buffalo Sabres",
                                "price": 2.5,
                                "link": null
                            },
                            {
                                "name": "Calgary Flames",
                                "price": 1.5,
                                "link": null
                            },
                            {
                                "name": "Draw",
                                "price": 3.5,
                                "link": null
                            }
                        ]
                    }
                ]
            },
            {
                "key": "betclic",
                "title": "Betclic",
                "last_update": "2024-11-10T06:27:03Z",
                "link": "https://www.betclic.fr/icehockey-nhl/buffalo-sabres-calgary-flames-m3002640758",
                "markets": [
                    {
                        "key": "h2h",
                        "last_update": "2024-11-10T06:27:03Z",
                        "link": null,
                        "outcomes": [
                            {
                                "name": "Buffalo Sabres",
                                "price": 2.5,
                                "link": null
                            },
                            {
                                "name": "Calgary Flames",
                                "price": 1.5,
                                "link": null
                            },
                            {
                                "name": "Draw",
                                "price": 3.5,
                                "link": null
                            }
                        ]
                    }
                ]
            },
            {
                "key": "nordicbet",
                "title": "Nordic Bet",
                "last_update": "2024-11-10T06:27:52Z",
                "link": "https://www.nordicbet.com/en/sportsbook/icehockey/nhl/buffalo-sabres-calgary-flames",
                "markets": [
                    {
                        "key": "h2h",
                        "last_update": "2024-11-10T06:27:52Z",
                        "link": null,
                        "outcomes": [
                            {
                                "name": "Buffalo Sabres",
                                "price": 2.5,
                                "link": null
                            },
                            {
                                "name": "Calgary Flames",
                                "price": 1.5,
                                "link": null
                            },
                            {
                                "name": "Draw",
                                "price": 3.5,
                                "link": null
                            }
                        ]
                    }
                ]
            },
        ]
    }
]

const testFixtures = [testFixturesIceHockey, testFixturesSoccer];

const batch = db.batch();

const apiConfig = {
    baseUrl: "https://api.the-odds-api.com/v4",
    apiKey: process.env.ODDS_API_KEY,
    commenceTimeFrom: new Date(new Date().setUTCHours(6, 0, 0, 0)).toISOString().split('.')[0] + 'Z',
    commenceTimeTo: new Date(new Date().setUTCHours(6, 0, 0, 0) + 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z'
}

const apiLinks = {
    icehockey: `${apiConfig.baseUrl}/sports/icehockey/odds/?apiKey=${apiConfig.apiKey}&regions=eu&commenceTimeFrom=${apiConfig.commenceTimeFrom}&commenceTimeTo=${apiConfig.commenceTimeTo}&includeLinks=true`,
    soccer: `${apiConfig.baseUrl}/sports/soccer/odds/?apiKey=${apiConfig.apiKey}&regions=eu&commenceTimeFrom=${apiConfig.commenceTimeFrom}&commenceTimeTo=${apiConfig.commenceTimeTo}&includeLinks=true`,
}

const requests = [
    axios.get(apiLinks.icehockey),
    axios.get(apiLinks.soccer)
]

export default async function fetchFixtures() {
    try {
        // const fixtures = [];
        // testFixtures.forEach((result) => {
        //     const sportFixtures = processFixtures(result);
        //     fixtures.push(sportFixtures);
        // });
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
        //console.log('Fixtures: ', fixtures);
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
        // console.log('Batch created');
        // console.log('Batch size: ', batch._ops.length);
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