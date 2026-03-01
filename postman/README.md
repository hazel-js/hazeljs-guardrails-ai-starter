# Postman Collection

Import these files into [Postman](https://www.postman.com/) to test the HazelJS Guardrails AI Starter APIs.

## Setup

1. **Import the collection**
   - File → Import → Select `HazelJS-Guardrails-AI-Starter.postman_collection.json`

2. **Import the environment** (optional)
   - File → Import → Select `HazelJS-Guardrails-Local.postman_environment.json`
   - Select "HazelJS Guardrails - Local" from the environment dropdown

3. **Start the server**
   ```bash
   npm run dev
   ```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat` | Chat with Pipe + Interceptor |
| GET | `/api/chat/decorated?message=` | Chat with decorators + @AITask |
| GET | `/api/chat/redact?text=` | PII redaction demo |
| GET | `/api/chat/check?text=` | Input check (debug) |

## Notes

- **Chat endpoints** require `OPENAI_API_KEY` in `.env` (or use Ollama with `AI_PROVIDER=ollama`)
- **Blocked requests** return HTTP 400 with `violations` and `blockedReason`
