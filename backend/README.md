# WanderAI Backend - AI Infrastructure Platform

Production-ready, modular AI backend platform for WanderAI built with FastAPI, Python, Motor (MongoDB), and Google Gemini API.

## Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── ai.py               # FastAPI Endpoints (/api/v1/ai)
│   ├── controllers/
│   │   └── ai_controller.py        # Controller Layer (Orchestration only)
│   ├── services/
│   │   ├── gemini_service.py       # Google Gemini REST API Client
│   │   ├── chat_service.py         # Chat Orchestration Service
│   │   ├── trip_service.py         # Trip Generation Infrastructure Service
│   │   ├── history_service.py      # History Query & Retrieval Service
│   │   ├── conversation_service.py # Session Lifecycle Manager
│   │   └── retry_service.py        # Exponential Backoff Retries
│   ├── repositories/
│   │   └── ai_repository.py        # MongoDB Async Persistence
│   ├── models/
│   │   └── ai_models.py            # Motor/MongoDB Document Models
│   ├── schemas/
│   │   └── ai_schemas.py           # Pydantic Request & Response Schemas
│   ├── prompts/
│   │   └── prompt_builder.py       # Structured Prompt Generator & Rules
│   ├── validators/
│   │   ├── request_validator.py    # Request Sanitizer & Validator
│   │   └── response_validator.py   # AI JSON Repair & Schema Validator
│   └── core/
│       ├── config.py               # Settings & Environment Validation
│       ├── exceptions.py           # Custom Domain Exceptions
│       └── logging_config.py       # Rotating File Logger (logs/app.log)
├── tests/
│   └── test_ai_platform.py         # Pytest Test Suite
├── docs/
│   └── ARCHITECTURE.md             # Architecture & Sequence Diagrams
├── .env.example                    # Environment Template
└── requirements.txt
```

## Quick Start Guide

### 1. Configure Environment
Copy `.env.example` to `.env` and set your configuration:
```bash
GEMINI_API_KEY=your_google_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash
MONGO_URI=mongodb://localhost:27017
LOG_LEVEL=INFO
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Server
```bash
uvicorn app.main:app --reload
```

### 4. Interactive Documentation
Access Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs).

### 5. Run Test Suite
```bash
pytest
```
