import httpx
from typing import List, Dict, Any
from app.core.logging_config import logger

class DistanceService:
    @staticmethod
    async def get_distance_matrix(coordinates: List[Dict[str, float]]) -> List[Dict[str, Any]]:
        """
        Uses OSRM to calculate distances between multiple coordinates.
        Coordinates list should be [{"lat": 23.2, "lon": 72.1}, ...]
        Returns a simplified distance matrix array.
        """
        if len(coordinates) < 2:
            return []
            
        # OSRM expects lon,lat format
        coords_str = ";".join([f"{c['lon']},{c['lat']}" for c in coordinates])
        url = f"http://router.project-osrm.org/table/v1/driving/{coords_str}?annotations=distance,duration"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=15.0)
                response.raise_for_status()
                data = response.json()
                
                matrix = []
                distances = data.get("distances", [])
                durations = data.get("durations", [])
                
                for i in range(len(coordinates)):
                    for j in range(len(coordinates)):
                        if i == j:
                            continue
                            
                        # Prevent index out of bounds
                        if i < len(distances) and j < len(distances[i]) and i < len(durations) and j < len(durations[i]):
                            dist_m = distances[i][j]
                            dur_s = durations[i][j]
                            
                            # Filter out nulls from OSRM (unreachable nodes)
                            if dist_m is None or dur_s is None:
                                continue
                                
                            matrix.append({
                                "from_index": i,
                                "to_index": j,
                                "distance_km": round(dist_m / 1000.0, 2),
                                "travel_time_mins": round(dur_s / 60.0),
                                "recommended_transport": "Driving/Taxi"
                            })
                return matrix
        except Exception as e:
            logger.error(f"DistanceService Error: {str(e)}")
            return []
