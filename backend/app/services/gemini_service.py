import time
from typing import Any, Dict, Optional
import httpx

from app.core.config import get_settings
from app.core.exceptions import GeminiAPIException, RateLimitException
from app.core.logging_config import logger

settings = get_settings()


class GeminiService:
    """
    High-performance async client interface for Google Gemini API.
    Supports connection pooling, dynamic model switching, custom temperature, token caps,
    automatic model fallback (gemini-2.0-flash / gemini-1.5-flash-latest), and safe error handling.
    """

    FALLBACK_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-2.5-flash"]

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        if self.model == "gemini-1.5-flash":
            self.model = "gemini-2.0-flash"
        self.timeout = settings.REQUEST_TIMEOUT
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    async def generate_content(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_output_tokens: int = 8192,
        model_override: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Sends an async HTTP POST request to Google Gemini API with automatic model fallback.
        Returns: Dict containing raw_text, model_used, latency_ms, tokens_used.
        """
        if not self.api_key:
            logger.warning("No GEMINI_API_KEY supplied or configured. Gemini API call skipped.")
            raise GeminiAPIException(
                message="Google Gemini API key is missing. Please configure GEMINI_API_KEY in environment or pass user API key."
            )

        active_model = model_override or self.model
        if active_model == "gemini-1.5-flash":
            active_model = "gemini-2.0-flash"

        models_to_try = [active_model] + [m for m in self.FALLBACK_MODELS if m != active_model]

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_output_tokens,
            },
        }

        start_time = time.perf_counter()

        async with httpx.AsyncClient(timeout=float(self.timeout)) as client:
            last_error = None
            for current_model in models_to_try:
                url = f"{self.base_url}/{current_model}:generateContent?key={self.api_key}"

                try:
                    response = await client.post(
                        url,
                        json=payload,
                        headers={"Content-Type": "application/json"},
                    )
                    latency_ms = (time.perf_counter() - start_time) * 1000.0

                    if response.status_code == 429:
                        logger.warning(f"Gemini API Rate Limit 429 hit for model {current_model}")
                        raise RateLimitException(message="Gemini API rate limit exceeded.")

                    if response.status_code == 404:
                        logger.warning(f"Gemini API 404 for model {current_model}. Attempting fallback model.")
                        last_error = f"Model {current_model} returned 404"
                        continue

                    if response.status_code != 200:
                        error_detail = response.text[:200]
                        logger.error(f"Gemini API error status {response.status_code} for {current_model}: {error_detail}")
                        last_error = f"Status {response.status_code}: {error_detail}"
                        continue

                    data = response.json()
                    raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    tokens_used = data.get("usageMetadata", {}).get("totalTokenCount", len(prompt.split()) + len(raw_text.split()))

                    logger.info(f"Gemini API request succeeded with model={current_model}, latency={latency_ms:.2f}ms")

                    return {
                        "raw_text": raw_text,
                        "model_used": current_model,
                        "latency_ms": round(latency_ms, 2),
                        "tokens_used": tokens_used,
                        "prompt_size": len(prompt),
                    }

                except (httpx.TimeoutException, httpx.RequestError) as exc:
                    logger.error(f"Network error connecting to Gemini API with model {current_model}: {exc}")
                    last_error = str(exc)
                    continue

            raise GeminiAPIException(
                message=f"Gemini API request failed across all models ({models_to_try}). Last error: {last_error}"
            )
