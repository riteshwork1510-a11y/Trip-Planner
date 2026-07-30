from typing import Dict, Any

class TransportService:
    @staticmethod
    def get_transport_options(destination: str, duration_days: int) -> Dict[str, Any]:
        """
        Calculates local transport modalities and estimated daily / trip costs.
        """
        return {
            "auto": f"Auto Rickshaws available across {destination}. Estimated ₹150 - ₹300 per day.",
            "taxi": f"AC Taxis / Cab aggregators active. Estimated ₹1,200 - ₹2,000 per day for full day sightseeing.",
            "metro": f"Local Metro / Rapid transit connection available in central zones (approx ₹30 - ₹60 per ride).",
            "bus": f"Local public bus routes operate between major tourist spots. ₹20 - ₹50 per trip.",
            "rentalBike": f"Scooter & Bike rentals available near center. ₹400 - ₹700 per day.",
            "rentalCar": f"Self-drive car rental options. ₹1,800 - ₹3,500 per day.",
            "walkingRoute": f"Pedestrian friendly Heritage & Market walks available in the central district."
        }
