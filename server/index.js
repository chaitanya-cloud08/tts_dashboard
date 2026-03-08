import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sarvamRouter from './routes/sarvam.js';
import cambRouter from './routes/camb.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TTS Dashboard API running' });
});

app.use('/api/sarvam', sarvamRouter);
app.use('/api/camb', cambRouter);

app.listen(PORT, () => {
  console.log(`🚀 TTS Dashboard server running on http://localhost:${PORT}`);
});
