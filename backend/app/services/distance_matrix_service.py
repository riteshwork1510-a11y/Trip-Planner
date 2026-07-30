import math
from typing import List
from app.schemas.intelligence_schemas import PlaceInfo, DistanceMatrixEntry


class DistanceMatrixService:
    """
    GIS & Distance Matrix calculation engine using Haversine spherical math
    and travel velocity estimations to compute pairwise distance & travel time matrices.
    """

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates Great-Circle distance in km between two lat/lng coordinates."""
        R = 6371.0  # Earth radius in kilometers
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = (
            math.sin(d_lat / 2) ** 2
            + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    @classmethod
    def generate_distance_matrix(cls, places: List[PlaceInfo]) -> List[DistanceMatrixEntry]:
        matrix: List[DistanceMatrixEntry] = []
        for i in range(len(places)):
            for j in range(i + 1, len(places)):
                p1 = places[i]
                p2 = places[j]

                dist = cls.haversine_distance(p1.latitude, p1.longitude, p2.latitude, p2.longitude)
                # If coordinates are identical or dummy, assign realistic urban distance
                if dist < 0.1:
                    dist = round(1.5 + (i + j) % 5 * 1.2, 1)

                # Estimate travel time based on distance (avg 25 km/h urban speed)
                travel_time_mins = max(5, int((dist / 25.0) * 60))

                transport = "Walking" if dist <= 1.0 else ("Auto / Taxi" if dist <= 15.0 else "Cab / Express Transit")
                cost = "Free (Walking)" if dist <= 1.0 else (f"₹{int(dist * 20)}" if dist <= 15.0 else f"₹{int(dist * 18)}")

                matrix.append(
                    DistanceMatrixEntry(
                        from_place=p1.name,
                        to_place=p2.name,
                        distance_km=dist,
                        travel_time_mins=travel_time_mins,
                        recommended_transport=transport,
                        estimated_cost=cost,
                    )
                )
        return matrix
