import asyncio
import random
from typing import Callable, Any, Type, Tuple
from app.core.config import get_settings
from app.core.logging_config import logger
from app.core.exceptions import GeminiAPIException, RateLimitException

settings = get_settings()


class RetryService:
    """
    Executes async functions with Exponential Backoff + Jitter retries.
    Only retries transient network / server errors, ignoring non-retryable 4xx validation errors.
    """

    @classmethod
    async def execute_with_retry(
        cls,
        func: Callable[..., Any],
        *args,
        max_retries: int = settings.MAX_RETRIES,
        initial_delay: float = 1.0,
        backoff_factor: float = 2.0,
        retryable_exceptions: Tuple[Type[Exception], ...] = (
            GeminiAPIException,
            RateLimitException,
            TimeoutError,
            ConnectionError,
        ),
        **kwargs,
    ) -> Any:
        delay = initial_delay
        last_exception = None

        for attempt in range(1, max_retries + 1):
            try:
                return await func(*args, **kwargs)
            except retryable_exceptions as exc:
                last_exception = exc
                if attempt == max_retries:
                    logger.error(f"Max retries ({max_retries}) exhausted for operation {func.__name__}. Error: {exc}")
                    raise exc

                # Add full jitter
                sleep_time = delay * (backoff_factor ** (attempt - 1)) + random.uniform(0, 0.5)
                logger.warning(
                    f"Transient failure on attempt {attempt}/{max_retries} in {func.__name__}: {exc}. "
                    f"Retrying in {sleep_time:.2f}s..."
                )
                await asyncio.sleep(sleep_time)
            except Exception as non_retryable:
                logger.error(f"Non-retryable error occurred in {func.__name__}: {non_retryable}")
                raise non_retryable

        if last_exception:
            raise last_exception
