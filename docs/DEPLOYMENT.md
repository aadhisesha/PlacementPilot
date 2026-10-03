# PlacementPilot Deployment

## Local development

```powershell
npm install
Copy-Item .env.example .env
npm run dev:full
```

Open the Vite URL shown by the terminal. The server reads `NVIDIA_API_KEY`, `NVIDIA_BASE_URL`, `NVIDIA_MODEL`, and `DEMO_MODE` from `.env`.

### Demo mode

Use:

```env
DEMO_MODE=true
NVIDIA_API_KEY=
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

This runs the UI and training workflow with deterministic demo data without sending requests to NVIDIA NIM.

### Live NVIDIA NIM mode

Use:

```env
DEMO_MODE=false
NVIDIA_API_KEY=your_nvidia_api_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

The NVIDIA key is read by the server-side runtime only. Never add it to a `VITE_*` variable. NVIDIA NIM uses a bearer token with its OpenAI-compatible chat-completions endpoint.

## Production deployment

1. Push the repository to GitHub.
2. Import the GitHub repository into Vercel.
3. Keep the Vite build configuration.
4. Vercel automatically exposes the files in `api/` as serverless functions.
5. Add `NVIDIA_API_KEY` as a Vercel server-side environment variable.
6. Optionally configure `NVIDIA_MODEL` and `NVIDIA_BASE_URL`.
7. Keep `DEMO_MODE=false` for live AI.
8. Redeploy after changing environment variables.

## Security checklist

- Never create `VITE_NVIDIA_API_KEY`.
- Never commit `.env` or credentials.
- Keep the API key only in Vercel/server environment variables.
- Limit JSON body size.
- Reject empty or suspiciously short resume/job requests.
- Treat uploaded document text as untrusted prompt context.
- Validate structured AI output before returning it.

## Deployment topology

```text
GitHub
  ├── Vercel static frontend
  └── Vercel serverless API
           │
           └── NVIDIA NIM API
```

## Health check

Production health endpoint:

```text
GET /api/health
```

Expected response:

```json
{"status":"ok","provider":"nvidia-nim","model":"nvidia/nemotron-3.5-lightning-30b-a3b","demoMode":true,"apiKeyConfigured":false}
```
