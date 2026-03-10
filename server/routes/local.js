import express from 'express';
import axios from 'axios';

const router = express.Router();

const LOCAL_TTS_BASE = 'http://qaaiml.timesinternet.in';

router.post('/tts', async (req, res) => {
  const { text, hostId = '83' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text (body) is required' });
  }

  if (!hostId) {
    return res.status(400).json({ error: 'hostId is required' });
  }

  const startTime = Date.now();

  try {
    const response = await axios.post(
      `${LOCAL_TTS_BASE}/epitome/v2/tts/generate`,
      {
        hostId: String(hostId),
        body: text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/wav',
        },
        responseType: 'arraybuffer',
        timeout: 120000, // 2 min timeout — LLM summarization + TTS can be slow
      }
    );

    const latencyMs = Date.now() - startTime;
    const audioBuffer = Buffer.from(response.data);
    const audioBase64 = audioBuffer.toString('base64');

    // Try to extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'] || '';
    const filenameMatch = contentDisposition.match(/filename="?([^";\s]+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : 'tts_output.wav';

    res.json({
      audioBase64,
      latencyMs,
      charCount: text.length,
      sampleRate: 22050, // typical for TTS WAV
      audioFormat: 'wav',
      filename,
      hostId,
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // Parse error response — the API returns JSON errors
    let errorDetail = { message: error.message };
    if (error.response?.data) {
      try {
        const errText = Buffer.isBuffer(error.response.data)
          ? error.response.data.toString('utf-8')
          : JSON.stringify(error.response.data);
        errorDetail = JSON.parse(errText);
      } catch {
        errorDetail.message = Buffer.isBuffer(error.response.data)
          ? error.response.data.toString('utf-8').substring(0, 500)
          : String(error.response.data);
      }
    }

    console.error('Local TTS error:', errorDetail);

    res.status(error.response?.status || 500).json({
      audioBase64: '',
      latencyMs,
      charCount: text.length,
      error: errorDetail.message || errorDetail.technical_message || error.message,
      errorDetail,
    });
  }
});

export default router;
