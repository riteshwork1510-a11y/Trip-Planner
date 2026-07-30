# Reusable AI Backend Platform Architecture

## Overview
This platform provides a secure, production-ready, modular AI backend for WanderAI. It handles Gemini API integration, prompt construction, request/response validation, automatic JSON repair, session history, and exponential backoff retry strategies.

## High-Level Architecture Diagram

```
+-----------------------------------------------------------------------+
|                         Next.js Frontend                              |
|   (lib/services/ai-api.ts <--> types/ai.ts)                           |
+-----------------------------------------------------------------------+
                                   |
                                   | HTTP REST (/api/v1/ai/*)
                                   v
+-----------------------------------------------------------------------+
|                      FastAPI AI Module (v1/ai.py)                     |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    AI Controller (ai_controller.py)                    |
|             (Pure Orchestration - No Business Logic)                  |
+-----------------------------------------------------------------------+
                                   |
       +---------------------------+---------------------------+
       |                           |                           |
       v                           v                           v
+---------------+          +---------------+          +------------------+
|  TripService  |          |  ChatService  |          |  HistoryService  |
+---------------+          +---------------+          +------------------+
       |                           |                           |
       +---------------------------+                           |
       |                                                       |
       v                                                       v
+------------------------------------+               +-------------------+
|  PromptBuilder                     |               |   AIRepository    |
|  - System Instructions             |               |   - MongoDB       |
|  - Destination & Travel Context    |               |   - Motor Client  |
|  - JSON Output Schemas             |               +-------------------+
+------------------------------------+                         ^
       |                                                       |
       v                                                       |
+------------------------------------------------------+       |
|  GeminiService (httpx AsyncClient)                   |       |
|  - Connection Pooling, Temperature, Token Caps       |       |
|  - Model Switching (gemini-1.5-flash / custom)       |       |
+------------------------------------------------------+       |
       |                                                       |
       v                                                       |
+------------------------------------------------------+       |
|  RetryService (Exponential Backoff + Jitter)         |       |
+------------------------------------------------------+       |
       |                                                       |
       v (HTTP POST)                                           |
+------------------------------------------------------+       |
|  Google Gemini REST API                              |       |
+------------------------------------------------------+       |
       |                                                       |
       v                                                       |
+------------------------------------------------------+       |
|  AIResponseValidator                                 |       |
|  - Automatic JSON Repairer & Schema Sanitizer        |       |
+------------------------------------------------------+       |
       |                                                       |
       +-------------------------------------------------------+
```

## Sequence Diagram (Trip Generation Request Flow)

```
Client (Next.js)      FastAPI Router     TripService     PromptBuilder    GeminiService      Google Gemini      ResponseValidator     AIRepository (MongoDB)
   |                       |                 |                 |                |                  |                    |                     |
   |-- POST /generate ---->|                 |                 |                |                  |                    |                     |
   |                       |-- generate ---->|                 |                |                  |                    |                     |
   |                       |                 |-- build ------>|                 |                  |                    |                     |
   |                       |                 |<-- prompt ------|                |                  |                    |                     |
   |                       |                 |                                  |                  |                    |                     |
   |                       |                 |-- execute_with_retry ----------->|                  |                    |                     |
   |                       |                 |                                  |-- POST request ->|                    |                     |
   |                       |                 |                                  |<-- 200 raw text --|                    |                     |
   |                       |                 |<-- raw result -------------------|                  |                    |                     |
   |                       |                 |                                                                          |                     |
   |                       |                 |-- validate & repair JSON ----------------------------------------------->|                     |
   |                       |                 |<-- validated dict -------------------------------------------------------|                     |
   |                       |                 |                                                                                                |
   |                       |                 |-- save_trip_generation & prompt_log ---------------------------------------------------------->|
   |                       |                 |<-- saved OK -----------------------------------------------------------------------------------|
   |                       |<-- response ----|                                                                                                |
   |<-- 200 OK Response ---|                 |                                                                                                |
```

## Endpoints Specification

### 1. Send Chat Message
- **URL**: `POST /api/v1/ai/chat`
- **Request Body**:
```json
{
  "conversation_id": "conv-12345",
  "message": "What is the best time to visit Gujarat?",
  "context": {}
}
```

### 2. Submit Trip Generation Request
- **URL**: `POST /api/v1/ai/generate-trip`
- **Request Body**:
```json
{
  "destination": "Gujarat",
  "duration_days": 5,
  "travelers": "couple",
  "budget_level": "moderate",
  "pace": "balanced",
  "interests": ["Culture", "Food"]
}
```

### 3. Regenerate Previous AI Output
- **URL**: `POST /api/v1/ai/regenerate`

### 4. Fetch History
- **URL**: `GET /api/v1/ai/history?limit=20&skip=0`

### 5. Fetch Single History Item
- **URL**: `GET /api/v1/ai/history/{id}`

### 6. Delete History Item
- **URL**: `DELETE /api/v1/ai/history/{id}`

## MongoDB Collections & Schema

1. `ai_conversations`: Session tracking (`conversation_id`, `user_id`, `message_count`, `context`, `updated_at`).
2. `ai_messages`: Individual messages (`conversation_id`, `sender`, `content`, `tokens_used`, `created_at`).
3. `trip_requests`: Raw user request parameters (`request_id`, `destination`, `duration_days`, `budget_level`, `created_at`).
4. `trip_generations`: Validated JSON responses (`generation_id`, `request_id`, `destination`, `model_used`, `validated_output`, `latency_ms`).
5. `prompt_logs`: Detailed execution logs (`log_id`, `action_type`, `prompt_text`, `gemini_response_text`, `execution_time_ms`, `tokens_estimated`).

## Developer Setup Instructions
1. Copy `.env.example` to `.env` in `backend/`.
2. Populate `GEMINI_API_KEY` with a valid Google Gemini API key.
3. Start backend: `uvicorn app.main:app --reload`
4. Access OpenAPI Docs at `http://localhost:8000/docs`.
5. Run tests: `pytest`
