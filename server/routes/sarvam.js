import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/tts', async (req, res) => {
  const { text, language = 'hi-IN', speaker = 'shubh' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    return res.json(mockSarvamResponse(text));
  }

  const startTime = Date.now();

  try {
    const response = await axios.post(
      'https://api.sarvam.ai/text-to-speech',
      {
        text: text,
        target_language_code: language,
        speaker: speaker,
        model: 'bulbul:v3',
        pace: 1.0,
        sample_rate: 24000,
        enable_preprocessing: true,
      },
      {
        headers: {
          'api-subscription-key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const latencyMs = Date.now() - startTime;
    const audioBase64 = response.data.audios?.[0] || '';

    res.json({
      audioBase64,
      latencyMs,
      charCount: text.length,
      sampleRate: 24000,
    });
  } catch (error) {
    console.error('Sarvam TTS error:', error?.response?.data || error.message);
    // Return mock with error info
    res.json({
      ...mockSarvamResponse(text),
      error: error?.response?.data?.message || error.message,
    });
  }
});

function mockSarvamResponse(text) {
  return {
    audioBase64: '',
    latencyMs: Math.floor(Math.random() * 400) + 200,
    charCount: text.length,
    sampleRate: 24000,
    mock: true,
    message: 'Mock response — add SARVAM_API_KEY to .env for real audio',
  };
}

export default router;
