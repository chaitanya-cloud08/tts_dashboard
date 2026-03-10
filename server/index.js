import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sarvamRouter from './routes/sarvam.js';
import cambRouter from './routes/camb.js';
import localRouter from './routes/local.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://client-n1z8ofeck-chaitanya-cloud08s-projects.vercel.app',
    /\.vercel\.app$/,
  ],
}));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TTS Dashboard API running' });
});

app.use('/api/sarvam', sarvamRouter);
app.use('/api/camb', cambRouter);
app.use('/api/local', localRouter);

app.listen(PORT, () => {
  console.log(`🚀 TTS Dashboard server running on http://localhost:${PORT}`);
});
