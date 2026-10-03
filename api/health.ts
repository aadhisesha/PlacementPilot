import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiConfig } from '../server/gemini';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const config = getGeminiConfig();
  return res.status(200).json({
    status: 'ok',
    provider: 'gemini',
    model: config.model,
    apiKeyConfigured: Boolean(config.apiKey),
  });
}
