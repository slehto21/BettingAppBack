import express from 'express';
import cors from 'cors';
import fixturesRoutes from './routes/fixturesRoutes.js';
import dotenv from 'dotenv';
import './services/scheduler.js'; // Import the scheduler to start the task

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT

app.use(cors());
app.use(express.json());

app.use("/api/fixtures", fixturesRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});