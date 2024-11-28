# Betting App Backend

The backend service for the [**Betting App**](https://github.com/slehto21/MobileBettingApp) fetches upcoming sports fixtures from the Odds-API, stores them with **Memcached**, and provides them to the frontend. 

## Features

- Fetches upcoming fixtures from the [Odds-API](https://the-odds-api.com/)
- Caches fixtures in **Memcached**
- Provides REST endpoints
- Automatically refreshes data daily
  
## Tech Stack

- Express.js
- Node.js
- Memcached
- Docker

## License

This project is licensed under the MIT License.

