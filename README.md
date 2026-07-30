# WanderAI — AI-Powered Tour Planning Platform

An intelligent travel planning platform that generates personalized itineraries using AI. Explore destinations on an interactive world map, get AI-crafted trip plans, manage expenses, and iterate on your travel itinerary through a conversational interface.

## Features

- **AI Trip Generation** — Generate complete day-by-day itineraries with budget breakdowns, hotel/restaurant recommendations, and packing lists via Google Gemini
- **Conversational Planner** — Build trips through a natural-language chat interface that collects preferences progressively
- **Interactive World Map** — Explore countries, states, cities, and tourist places with zoom/pan, clustering, and detailed info panels (powered by D3 + react-simple-maps)
- **Trip Management** — View, filter, and manage your trips with status tracking (upcoming, ongoing, completed, cancelled)
- **Itinerary Editing** — Modify generated trips with AI-assisted changes, version history, and diff previews
- **Expense Tracking** — Log and categorize trip expenses
- **Authentication** — JWT-based auth with register, login, password reset
- **Destination Intelligence** — GeoJSON-based state/city boundaries, weather forecasts, distance matrices, and route optimization

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 16.2** (App Router) | React framework with static export |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animations |
| **react-simple-maps / D3** | Interactive world map & geographic visualizations |
| **supercluster** | Map marker clustering |
| **Lucide React** | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python async REST framework |
| **Motor** | Async MongoDB driver |
| **Pydantic v2** | Data validation & schemas |
| **Google Gemini API** | AI trip generation |
| **python-jose** | JWT authentication |
| **passlib + argon2** | Password hashing |
| **httpx** | Async HTTP client |

### Infrastructure

| Component | Details |
|-----------|---------|
| **Database** | MongoDB |
| **Auth** | JWT (access + refresh tokens) |
| **Logging** | Rotating file logs |
| **Testing** | pytest |

## Architecture

```
wanderai/
├── frontend/          # Next.js SPA (static export)
│   ├── app/           # App Router pages & layouts
│   ├── components/    # Reusable UI (map, auth, home, layout, etc.)
│   ├── lib/           # API clients, utilities, data modules
│   ├── types/         # Shared TypeScript definitions
│   ├── hooks/         # Custom React hooks
│   └── contexts/      # React contexts (AuthContext)
│
├── backend/           # FastAPI REST API
│   ├── app/
│   │   ├── api/       # Route definitions (v1, routes)
│   │   ├── controllers/    # Orchestration layer
│   │   ├── services/       # Business logic (AI, chat, trips, auth, etc.)
│   │   ├── models/         # MongoDB document models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── prompts/        # Gemini prompt builder
│   │   ├── repositories/   # MongoDB persistence
│   │   ├── validators/     # Response JSON repair & validation
│   │   └── core/           # Config, security, logging, DB
│   ├── tests/         # pytest test suite
│   └── docs/          # Architecture documentation
│
└── (root)             # .gitignore, README.md
```

The frontend communicates with the backend via REST endpoints (`/api/v1/ai/*`, `/api/v1/auth/*`, `/api/v1/trips/*`, etc.). The backend orchestrates AI calls through a layered pipeline: Router → Controller → Service → PromptBuilder → GeminiService (with retry) → ResponseValidator → MongoDB persistence.

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your GEMINI_API_KEY, MONGO_URI, JWT_SECRET_KEY

# Run server
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend

npm install

# Create environment file
cp .env.local.example .env.local
# (or edit existing .env.local)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run lint
```

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/chat` | Send chat message for conversational planning |
| POST | `/api/v1/ai/generate-trip` | Generate AI trip itinerary |
| POST | `/api/v1/ai/regenerate` | Regenerate portion of an itinerary |
| GET | `/api/v1/ai/history` | Fetch generation history |
| GET | `/api/v1/ai/history/{id}` | Fetch single history item |
| DELETE | `/api/v1/ai/history/{id}` | Delete history item |
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET/POST/PUT/DELETE | `/api/v1/trips/*` | Trip CRUD operations |
| GET/POST/PUT/DELETE | `/api/v1/expenses/*` | Expense CRUD operations |
| GET | `/api/v1/destinations/*` | Destination data & intelligence |
