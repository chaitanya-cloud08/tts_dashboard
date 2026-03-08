import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/tts', async (req, res) => {
  const { text, voice = 147320, speed = 1.0, pitch = 0, language = 'en-us' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const apiKey = process.env.CAMB_API_KEY;
  if (!apiKey || apiKey === 'your_camb_api_key_here') {
    return res.json(mockCambResponse(text));
  }

  const startTime = Date.now();

  try {
    // CAMB AI TTS streaming endpoint — returns raw audio bytes
    const response = await axios.post(
      'https://client.camb.ai/apis/tts-stream',
      {
        text,
        voice_id: typeof voice === 'number' ? voice : parseInt(voice, 10) || 147320,
        language: language,
        speech_model: 'mars-pro',
        output_configuration: {
          format: 'wav',
        },
      },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      }
    );

    const latencyMs = Date.now() - startTime;
    const audioBase64 = Buffer.from(response.data).toString('base64');

    res.json({
      audioBase64,
      latencyMs,
      charCount: text.length,
      sampleRate: 44100,
      audioFormat: 'wav',
    });
  } catch (error) {
    console.error('CAMB TTS error:', error?.response?.data
      ? Buffer.isBuffer(error.response.data)
        ? error.response.data.toString('utf-8').substring(0, 500)
        : error.response.data
      : error.message);
    res.json({
      ...mockCambResponse(text),
      error: error?.response?.status === 401
        ? 'Invalid API key'
        : error?.message || 'API error',
    });
  }
});

function mockCambResponse(text) {
  return {
    audioBase64: '',
    latencyMs: Math.floor(Math.random() * 600) + 300,
    charCount: text.length,
    sampleRate: 44100,
    mock: true,
    message: 'Mock response — add CAMB_API_KEY to .env for real audio',
  };
}

export default router;
