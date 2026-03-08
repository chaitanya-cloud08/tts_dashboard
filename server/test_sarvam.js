import 'dotenv/config';
import axios from 'axios';

const apiKey = process.env.SARVAM_API_KEY;

try {
  const response = await axios.post(
    'https://api.sarvam.ai/text-to-speech',
    {
      text: 'Hello world',
      target_language_code: 'en-IN',
      speaker: 'shubh',
      model: 'bulbul:v3',
      pace: 1.0,
      sample_rate: 24000,
    },
    {
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );
  console.log('SUCCESS');
  console.log('has_audios=' + !!response.data.audios);
  console.log('audio_length=' + (response.data.audios?.[0]?.length || 0));
} catch (error) {
  console.log('ERROR status=' + error?.response?.status);
  const d = error?.response?.data;
  if (d?.error) {
    console.log('msg=' + d.error.message);
  } else {
    console.log('raw=' + JSON.stringify(d).substring(0, 300));
  }
}
