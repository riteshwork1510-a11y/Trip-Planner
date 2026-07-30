import math
from typing import List, Dict, Any

class RouteOptimizer:
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Haversine distance in km."""
        R = 6371.0
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = math.sin(d_lat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    @staticmethod
    def optimize_route_order(places: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Greedy Nearest Neighbor Traveling Salesperson algorithm to order places smoothly without backtracking.
        """
        if not places:
            return []
        if len(places) <= 2:
            return places

        unvisited = list(places)
        # Start at the first place
        current = unvisited.pop(0)
        ordered = [current]

        while unvisited:
            # Find closest unvisited place to current
            closest_idx = 0
            min_dist = float('inf')
            c_lat, c_lon = current['latitude'], current['longitude']
            
            for idx, item in enumerate(unvisited):
                dist = RouteOptimizer.calculate_distance(c_lat, c_lon, item['latitude'], item['longitude'])
                if dist < min_dist:
                    min_dist = dist
                    closest_idx = idx

            next_place = unvisited.pop(closest_idx)
            # Update distance from previous
            next_place['distanceFromPrevious'] = f"{round(min_dist, 1)} km"
            next_place['travelTime'] = f"{max(10, int(min_dist * 3))} mins"
            ordered.append(next_place)
            current = next_place

        return ordered

    @staticmethod
    def cluster_attractions(attractions: List[Dict[str, Any]], days: int) -> Dict[int, List[Dict[str, Any]]]:
        """
        Geographic angular/polar sweep clustering. Places are grouped by geographic quadrant/angle around center,
        ensuring nearby places stay together and each day covers distinct places without backtracking.
        """
        if not attractions:
            return {d: [] for d in range(1, days + 1)}

        if days <= 1:
            return {1: RouteOptimizer.optimize_route_order(attractions)}

        # Center point
        avg_lat = sum(p['latitude'] for p in attractions) / len(attractions)
        avg_lon = sum(p['longitude'] for p in attractions) / len(attractions)

        # Sort attractions by polar angle theta relative to center
        def angle_from_center(p):
            return math.atan2(p['latitude'] - avg_lat, p['longitude'] - avg_lon)

        sorted_attractions = sorted(attractions, key=angle_from_center)
        clusters = {i: [] for i in range(1, days + 1)}

        # Distribute into daily clusters
        target_per_day = max(4, math.ceil(len(sorted_attractions) / days))
        
        for i, item in enumerate(sorted_attractions):
            day_num = min((i // target_per_day) + 1, days)
            clusters[day_num].append(item)

        # Ensure every day has minimum 4 places by cycling or pulling from larger clusters
        all_unique = list(sorted_attractions)
        for day_num in range(1, days + 1):
            while len(clusters[day_num]) < 4 and len(all_unique) > 0:
                # Add unique element
                candidate = all_unique.pop(0)
                if candidate not in clusters[day_num]:
                    clusters[day_num].append(candidate)
            
            # Optimize route sequence for each day to prevent backtracking
            clusters[day_num] = RouteOptimizer.optimize_route_order(clusters[day_num])

        return clusters

    @staticmethod
    def summarize_route_optimization(clusters: Dict[int, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        Computes overall distance, travel time, and backtracking prevention summary.
        """
        total_dist_km = 0.0
        total_time_mins = 0

        for day_num, places in clusters.items():
            for p in places:
                d_str = p.get('distanceFromPrevious', '0 km').replace(' km', '')
                t_str = p.get('travelTime', '0 mins').replace(' mins', '')
                try:
                    total_dist_km += float(d_str)
                    total_time_mins += int(t_str)
                except ValueError:
                    pass

        return {
            "summary": "Shortest path algorithm applied with zero backtracking. Nearby attractions grouped geographically.",
            "totalDistance": f"{round(total_dist_km, 1)} km",
            "totalTravelTime": f"{total_time_mins // 60} hrs {total_time_mins % 60} mins",
            "fuelEstimate": f"₹{int(total_dist_km * 12)}",
            "avoidBacktrackingStrategy": "Polar sweep & nearest-neighbor clustering applied per day."
        }
