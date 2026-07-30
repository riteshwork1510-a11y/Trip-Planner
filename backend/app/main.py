from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.database import connect_to_database, close_database_connection
from app.api.routes.auth_routes import router as auth_router
from app.api.routes.user_routes import router as user_router
from app.api.routes.trip_routes import router as trip_router
from app.api.routes.destination_routes import router as destination_router
from app.api.routes.expense_routes import router as expense_router
from app.api.v1.ai import router as ai_router
from app.api.v1.recommendations import router as recommendation_router
from app.api.v1.intelligence import router as intelligence_router
from app.api.v1.trip_api import router as trip_api_router
from app.repositories.ai_repository import AIRepository
from app.services.version_manager import VersionManager

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_database()
    # Initialize MongoDB Indexes
    ai_repo = AIRepository()
    await ai_repo.create_indexes()
    await VersionManager.create_version_indexes()

    from app.services.destination_service import seed_destinations
    await seed_destinations()
    yield
    await close_database_connection()


app = FastAPI(
    title=f"{settings.APP_NAME} - AI Platform API",
    description="Backend API for WanderAI AI Trip Planner. Provides secure Gemini AI infrastructure, Destination Intelligence Engine, and trip planning.",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(trip_router)
app.include_router(destination_router)
app.include_router(expense_router)
app.include_router(ai_router)
app.include_router(recommendation_router)
app.include_router(intelligence_router)
app.include_router(trip_api_router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error_code": "INTERNAL_ERROR",
            "details": str(exc) if settings.APP_ENV == "development" else {},
        },
    )


@app.get("/", tags=["Health"])
async def root():
    return {
        "success": True,
        "message": f"{settings.APP_NAME} API is running",
        "version": settings.APP_VERSION,
        "env": settings.APP_ENV,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "success": True,
        "message": "API is healthy",
        "gemini_model": settings.GEMINI_MODEL,
    }
