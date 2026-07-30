from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from app.schemas.intelligence_schemas import IntelligenceRequest, IntelligenceResponse
from app.services.destination_intelligence_service import DestinationIntelligenceService
from app.services.destination_intelligence.engine import DestinationIntelligenceEngine

router = APIRouter(prefix="/api/v1/intelligence", tags=["Destination Intelligence"])


@router.post(
    "/build-context",
    summary="Build Destination Knowledge Graph & Enriched Prompt",
    description="Collects attractions, distance matrix, hotels, restaurants, and generates enriched prompt without calling Gemini.",
)
async def build_context(request: IntelligenceRequest):
    try:
        graph = await DestinationIntelligenceService.build_knowledge_graph(request)
        from app.services.context_builder import ContextBuilder
        prompt = ContextBuilder.build_enriched_prompt(graph)
        return {
            "success": True,
            "destination": request.destination,
            "knowledge_graph": graph,
            "context_prompt": prompt,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": str(e)},
        )


@router.post(
    "/generate-itinerary",
    response_model=IntelligenceResponse,
    summary="Generate Non-Hallucinated Itinerary using Destination Intelligence Graph",
    description="Builds knowledge graph, passes enriched context to Gemini API, and returns non-hallucinated structured itinerary.",
)
async def generate_itinerary(request: IntelligenceRequest):
    try:
        response = await DestinationIntelligenceService.build_context_and_generate(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": str(e)},
        )

@router.post(
    "/stream-context",
    summary="Stream Live Destination Intelligence (SSE)",
    description="Streams real-time updates as live destination data is aggregated, yielding the final prompt."
)
async def stream_context(request: Request):
    try:
        # We need to read json manually since StreamingResponse doesn't always play well with Pydantic in POST
        data = await request.json()
        return StreamingResponse(
            DestinationIntelligenceEngine.build_context_stream(data),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
