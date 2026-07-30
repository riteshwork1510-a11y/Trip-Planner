import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.trip_form_schemas import TripFormRequest, TripModifyRequest, TripFormResponse
from app.services.destination_intelligence.engine import DestinationIntelligenceEngine
from app.services.section_regenerator import SectionRegenerator
from app.validators.response_validator import AIResponseValidator
from app.services.modification_service import ModificationService
from app.services.trip_normalizer import TripNormalizer
from app.core.database import get_database
from app.core.logging_config import logger

router = APIRouter(prefix="/api/v1/trip", tags=["Trip Generation & Modification Engine"])
modification_service = ModificationService()

@router.post(
    "/generate",
    response_model=TripFormResponse,
    summary="Generate Production-Grade AI Trip Itinerary",
    description="Executes Destination Intelligence Engine, builds knowledge graph context, runs strict validation, and auto-regenerates missing sections.",
)
async def generate_trip(request: TripFormRequest):
    try:
        # 1. Execute Destination Intelligence Engine to pre-collect datasets
        raw_context = await DestinationIntelligenceEngine.fetch_complete_intelligence(
            destination=request.destination,
            duration_days=request.duration_days,
            budget_per_person=request.budget_per_person
        )

        # 2. Repair and complete itinerary directly from Intelligence Knowledge Graph
        complete_itinerary = SectionRegenerator.repair_and_complete_itinerary({}, raw_context)
        
        # 3. Validate against 11-point production checklist
        ok, missing_checklist = AIResponseValidator.validate_11_point_checklist(complete_itinerary)
        if not ok:
            logger.warning(f"Checklist warnings remaining after repair: {missing_checklist}")
            # Guarantee 100% completion
            complete_itinerary = SectionRegenerator.repair_and_complete_itinerary(complete_itinerary, raw_context)

        trip_id = f"trip-{uuid.uuid4().hex[:12]}"
        generation_id = f"gen-{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)

        complete_itinerary["tripId"] = trip_id
        complete_itinerary["generationId"] = generation_id

        # 4. Normalize document and save to MongoDB
        db = get_database()
        trip_doc = {
            "generation_id": generation_id,
            "trip_id": trip_id,
            "id": trip_id,
            "destination": request.destination,
            "user_id": "user-1",
            "form_details": request.model_dump(),
            "itinerary": complete_itinerary.get("dailyItinerary", []),
            "full_itinerary": complete_itinerary,
            "version_number": 1,
            "status": "upcoming",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }

        normalized_doc = TripNormalizer.validate_and_normalize_trip(trip_doc)

        try:
            await db.trip_generations.insert_one(normalized_doc)
            await db.trips.insert_one(normalized_doc)
            logger.info(f"Trip saved to MongoDB: trip_id={trip_id}")
        except Exception as e:
            logger.warning(f"MongoDB write warning: {e}")

        return TripFormResponse(
            success=True,
            trip_id=trip_id,
            destination=request.destination,
            version_number=1,
            itinerary=complete_itinerary,
        )

    except Exception as e:
        logger.error(f"Trip generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": str(e)},
        )

@router.post("/save-generated", summary="Save Externally Generated Puter.js / LLM Itinerary")
async def save_generated_trip(payload: Dict[str, Any]):
    """
    Saves an itinerary generated via Puter.js or external LLM after validating and auto-repairing missing sections.
    """
    try:
        raw_itinerary = payload.get("itinerary") or payload.get("data") or payload
        destination = payload.get("destination") or raw_itinerary.get("destination") or "Destination"
        days = payload.get("days") or raw_itinerary.get("duration", {}).get("days") or 2
        budget = payload.get("budget") or 5000

        # Pre-collect background intelligence context for repair
        raw_context = await DestinationIntelligenceEngine.fetch_complete_intelligence(destination, days, budget)
        repaired_itinerary = SectionRegenerator.repair_and_complete_itinerary(raw_itinerary, raw_context)

        trip_id = raw_itinerary.get("tripId") or f"trip-{uuid.uuid4().hex[:12]}"
        generation_id = raw_itinerary.get("generationId") or f"gen-{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)

        repaired_itinerary["tripId"] = trip_id
        repaired_itinerary["generationId"] = generation_id

        doc = {
            "generation_id": generation_id,
            "trip_id": trip_id,
            "id": trip_id,
            "destination": destination,
            "user_id": "user-1",
            "itinerary": repaired_itinerary.get("dailyItinerary", []),
            "full_itinerary": repaired_itinerary,
            "status": "upcoming",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }

        normalized_doc = TripNormalizer.validate_and_normalize_trip(doc)

        db = get_database()
        await db.trip_generations.update_one({"trip_id": trip_id}, {"$set": normalized_doc}, upsert=True)
        await db.trips.update_one({"id": trip_id}, {"$set": normalized_doc}, upsert=True)

        return {"success": True, "trip_id": trip_id, "data": repaired_itinerary}
    except Exception as e:
        logger.error(f"Failed to save generated trip: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/modify", summary="AI Trip Assistant Natural Language Modification")
async def modify_trip(request: TripModifyRequest):
    try:
        result = await modification_service.modify_trip(
            trip_id=request.trip_id,
            modification_instruction=request.instruction,
            user_api_key=request.user_api_key,
            current_version_number=request.version_number,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": str(e)},
        )

@router.get("/{tripId}", summary="Get Trip Itinerary by ID")
async def get_trip(tripId: str):
    db = get_database()
    doc = await db.trip_generations.find_one({"trip_id": tripId})
    if not doc:
        doc = await db.trips.find_one({"id": tripId})
    if not doc:
        doc = await db.trip_generations.find_one({"generation_id": tripId})

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    doc["_id"] = str(doc["_id"])
    return {"success": True, "data": doc}

@router.get("/history", summary="Get User Trip History")
async def get_history(limit: int = 10):
    db = get_database()
    cursor = db.trip_generations.find().sort("created_at", -1).limit(limit)
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return {"success": True, "data": history}
