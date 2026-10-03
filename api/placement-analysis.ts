import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { PlacementRequest } from '../src/types/placement';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  let clientError: ((error: unknown) => { statusCode: number; message: string }) | undefined;
  try {
    if (!req.body || typeof req.body !== 'object') return res.status(400).json({ error: 'Request body must be a JSON object.' });
    const [{ handlePlacementAnalysis }, gemini] = await Promise.all([
      import('../server/placementAnalysis'),
      import('../server/gemini'),
    ]);
    clientError = gemini.clientError;
    const result = await handlePlacementAnalysis(req.body as PlacementRequest);
    return res.status(200).json(result);
  } catch (error) {
    const safeError = clientError?.(error) || {
      statusCode: 500,
      message: 'The placement analysis function could not be loaded. Check the Vercel function logs.',
    };
    console.error(`Placement analysis failed (${error instanceof Error ? error.stack || error.message : 'unknown error'}).`);
    return res.status(safeError.statusCode).json({ error: safeError.message });
  }
}
