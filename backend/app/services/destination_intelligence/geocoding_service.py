import httpx
from typing import Dict, Any, Optional
from app.core.logging_config import logger

# Offline fallback geocode database for reliability
KNOWN_DESTINATIONS = {
    "pavagadh": {"latitude": 22.4646, "longitude": 73.5226, "city": "Halol", "state": "Gujarat", "country": "India"},
    "dwarka": {"latitude": 22.2402, "longitude": 68.9686, "city": "Dwarka", "state": "Gujarat", "country": "India"},
    "sarangpur": {"latitude": 22.2570, "longitude": 71.7686, "city": "Botad", "state": "Gujarat", "country": "India"},
    "manali": {"latitude": 32.2432, "longitude": 77.1892, "city": "Manali", "state": "Himachal Pradesh", "country": "India"},
    "goa": {"latitude": 15.2993, "longitude": 74.1240, "city": "Panaji", "state": "Goa", "country": "India"},
    "dubai": {"latitude": 25.2048, "longitude": 55.2708, "city": "Dubai", "state": "Dubai", "country": "United Arab Emirates"},
    "paris": {"latitude": 48.8566, "longitude": 2.3522, "city": "Paris", "state": "Île-de-France", "country": "France"},
    "bali": {"latitude": -8.4095, "longitude": 115.1889, "city": "Denpasar", "state": "Bali", "country": "Indonesia"},
    "leh": {"latitude": 34.1526, "longitude": 77.5771, "city": "Leh", "state": "Ladakh", "country": "India"},
    "kashmir": {"latitude": 34.0837, "longitude": 74.7973, "city": "Srinagar", "state": "Jammu & Kashmir", "country": "India"},
}

class GeocodingService:
    @staticmethod
    async def get_coordinates(destination: str) -> Dict[str, Any]:
        """
        Uses Nominatim API (OpenStreetMap) with fallback database to resolve destination coordinates & admin info.
        """
        dest_clean = destination.strip().lower()
        
        # Check known offline DB first for fast resolution or fallback
        fallback_data = None
        for key, val in KNOWN_DESTINATIONS.items():
            if key in dest_clean:
                fallback_data = {
                    "latitude": val["latitude"],
                    "longitude": val["longitude"],
                    "display_name": f"{destination}, {val['state']}, {val['country']}",
                    "city": val["city"],
                    "state": val["state"],
                    "country": val["country"],
                    "boundingbox": None
                }
                break

        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": destination,
            "format": "json",
            "addressdetails": 1,
            "limit": 1
        }
        headers = {
            "User-Agent": "WanderAI-Travel-Planner/1.0 (contact@wanderai.com)"
        }
        
        try:
            async with httpx.AsyncClient(verify=False) as client:
                response = await client.get(url, params=params, headers=headers, timeout=8.0)
                if response.status_code == 200:
                    data = response.json()
                    if data:
                        res = data[0]
                        address = res.get("address", {})
                        city = address.get("city") or address.get("town") or address.get("village") or address.get("county") or destination
                        state = address.get("state", "")
                        country = address.get("country", "India")
                        return {
                            "latitude": float(res["lat"]),
                            "longitude": float(res["lon"]),
                            "display_name": res.get("display_name", destination),
                            "city": city,
                            "state": state,
                            "country": country,
                            "boundingbox": res.get("boundingbox")
                        }
        except Exception as e:
            logger.warning(f"GeocodingService network request failed for {destination}: {str(e)}")

        if fallback_data:
            return fallback_data

        # Default fallback if unknown
        return {
            "latitude": 22.4646,
            "longitude": 73.5226,
            "display_name": f"{destination}, India",
            "city": destination,
            "state": "Gujarat",
            "country": "India",
            "boundingbox": None
        }

