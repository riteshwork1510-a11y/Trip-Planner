import httpx
from typing import Dict, Any
from app.core.logging_config import logger

class WeatherService:
    @staticmethod
    async def get_weather(lat: float, lon: float) -> Dict[str, Any]:
        """
        Uses Open-Meteo API to fetch weather details for the destination.
        """
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": True,
            "timezone": "auto"
        }
        
        try:
            async with httpx.AsyncClient(verify=False) as client:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                
                current = data.get("current_weather", {})
                
                return {
                    "temperature_celsius": current.get("temperature", "Unknown"),
                    "windspeed_kmh": current.get("windspeed", "Unknown"),
                    "weathercode": current.get("weathercode", "Unknown")
                }
        except Exception as e:
            logger.error(f"WeatherService Error: {str(e)}")
            return {"temperature_celsius": "Unknown"}
