from typing import Dict, List
import math
from app.schemas.intelligence_schemas import PlaceInfo, DistanceMatrixEntry
from app.services.destination_collectors import PlaceCollector

class RankingEngine:
    """Ranks attractions using popularity, ratings, user interest alignment, and accessibility."""

    @classmethod
    def rank_attractions(cls, attractions: List[PlaceInfo], interests: List[str]) -> List[PlaceInfo]:
        def compute_score(place: PlaceInfo) -> float:
            score = place.popularity_score * 15.0 + place.average_rating * 10.0
            for interest in interests:
                if interest.lower() in place.category.lower() or interest.lower() in place.short_description.lower():
                    score += 20.0
                    break
            # Additional small boosts
            if getattr(place, "family_friendly", False):
                score += 5.0
            if getattr(place, "wheelchair_accessible", False):
                score += 5.0
            return score

        return sorted(attractions, key=compute_score, reverse=True)


class DayPlanner:
    """Geographically clusters nearby attractions into distance-based Day clusters."""

    @classmethod
    def haversine(cls, lat1, lon1, lat2, lon2):
        R = 6371  # Earth radius in km
        dLat = math.radians(lat2 - lat1)
        dLon = math.radians(lon2 - lon1)
        a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2) * math.sin(dLon/2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    @classmethod
    def cluster_attractions_into_days(
        cls,
        destination_name: str,
        attractions: List[PlaceInfo],
        distance_matrix: List[DistanceMatrixEntry],
        duration_days: int,
    ) -> Dict[int, List[PlaceInfo]]:
        if not attractions:
            return {}

        days_plan: Dict[int, List[PlaceInfo]] = {d: [] for d in range(1, duration_days + 1)}
        
        # 1. Geocode the destination center
        center_lat, center_lon = PlaceCollector.geocode(destination_name)
        
        # 2. Cluster by distance from center
        cluster_a = [] # 0-3 km
        cluster_b = [] # 3-8 km
        cluster_c = [] # 8-15 km
        cluster_d = [] # 15-30 km
        cluster_e = [] # 30-50 km
        
        for attr in attractions:
            dist = cls.haversine(center_lat, center_lon, attr.latitude, attr.longitude)
            if dist <= 3.0:
                cluster_a.append(attr)
            elif dist <= 8.0:
                cluster_b.append(attr)
            elif dist <= 15.0:
                cluster_c.append(attr)
            elif dist <= 30.0:
                cluster_d.append(attr)
            else:
                cluster_e.append(attr)
                
        clusters = [cluster_a, cluster_b, cluster_c, cluster_d, cluster_e]
        
        # 3. Assign clusters to days (expanding outward)
        # We assign at most ~3-4 places per day to avoid overcrowding
        unvisited = list(attractions)
        
        for current_day in range(1, duration_days + 1):
            # Try to pick the next available outward cluster
            cluster_idx = min(current_day - 1, len(clusters) - 1)
            target_cluster = clusters[cluster_idx]
            
            # If target cluster is empty, search subsequent clusters, then previous clusters
            if not target_cluster:
                found = False
                for i in range(cluster_idx + 1, len(clusters)):
                    if clusters[i]:
                        target_cluster = clusters[i]
                        found = True
                        break
                if not found:
                    for i in range(cluster_idx - 1, -1, -1):
                        if clusters[i]:
                            target_cluster = clusters[i]
                            break
            
            # Fill the day
            slots_left = 3
            while target_cluster and slots_left > 0:
                place = target_cluster.pop(0)
                days_plan[current_day].append(place)
                if place in unvisited:
                    unvisited.remove(place)
                slots_left -= 1
                
            # If we still need places for this day and the target cluster ran out, fill from nearest remaining
            if slots_left > 0 and unvisited:
                for _ in range(slots_left):
                    if unvisited:
                        # Find nearest to center among unvisited
                        unvisited.sort(key=lambda p: cls.haversine(center_lat, center_lon, p.latitude, p.longitude))
                        place = unvisited.pop(0)
                        days_plan[current_day].append(place)
                        
                        # Remove from its original cluster list so it doesn't get used again
                        for c in clusters:
                            if place in c:
                                c.remove(place)

        return days_plan
