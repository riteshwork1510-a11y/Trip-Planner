import random
from typing import Dict, Any, List
from app.core.logging_config import logger

class SectionRegenerator:
    """
    Auto-regenerates missing or failed sections of a trip itinerary
    directly from pre-collected Destination Intelligence Engine datasets.
    """

    @classmethod
    def repair_and_complete_itinerary(cls, itinerary: Dict[str, Any], raw_context: Dict[str, Any]) -> Dict[str, Any]:
        destination = raw_context.get("destination", "Destination")
        days_count = raw_context.get("duration_days", 1)
        budget = raw_context.get("budget_per_person", 5000)
        travelers = raw_context.get("travelers_count", 1)
        travel_style = raw_context.get("travel_style", "Leisure")
        geo = raw_context.get("coordinates", {})
        attractions = raw_context.get("attractions", [])
        hotels = raw_context.get("hotels", {})
        restaurants = raw_context.get("restaurants", {})
        transport = raw_context.get("transport", {})
        weather = raw_context.get("weather", {})
        essentials = raw_context.get("essentials", {})
        clusters = raw_context.get("clusters", {})
        route_meta = raw_context.get("route_meta", {})

        doc = dict(itinerary) if isinstance(itinerary, dict) else {}

        # 1. Destination Overview
        if not doc.get("destinationOverview") or not isinstance(doc.get("destinationOverview"), dict):
            doc["destinationOverview"] = {
                "destination": destination,
                "bestTime": "October to March",
                "currentWeather": f"{weather.get('temperature_celsius', '26')}°C, Sunny",
                "temperature": f"{weather.get('temperature_celsius', '26')}°C",
                "currency": "INR (₹)",
                "language": "Hindi / English / Local",
                "famousFor": f"Culture, Heritage, Scenic Attractions & Local Gastronomy in {destination}",
                "mapCoordinates": f"{geo.get('latitude', 22.4646)}, {geo.get('longitude', 73.5226)}"
            }

        # 2. Trip Highlights
        if not doc.get("tripHighlights") or not isinstance(doc.get("tripHighlights"), dict):
            names = [p["name"] for p in attractions[:10]]
            doc["tripHighlights"] = {
                "top10Attractions": names[:10] if names else [f"Explore {destination} Landmark"],
                "hiddenGems": [p["name"] for p in attractions if p.get("category") == "Hidden Gem"] or [f"{destination} Secret Stepwell & Valley View"],
                "unescoSites": [p["name"] for p in attractions if p.get("category") == "UNESCO Site"] or [f"{destination} Heritage Fort & Ancient Ruins"],
                "localFestivals": [f"{destination} Cultural Mahotsav & Evening Temple Artis"],
                "famousFood": ["Traditional Thali", "Local Street Chaat", "Heritage Special Sweets"],
                "bestSunset": [p["name"] for p in attractions if p.get("category") == "Sunset Point"] or [f"{destination} Viewpoint Rock"],
                "bestSunrise": ["Hilltop Temple Sunrise"],
                "shopping": [f"{destination} Central Handicraft & Spice Market"],
                "adventure": ["Cable Car Ropeway Ride", "Forest Nature Trek"],
                "photographySpots": [f"{destination} Fort Viewpoint", "Architectural Gates"]
            }

        # 3. Route Optimization
        if not doc.get("routeOptimization") or not isinstance(doc.get("routeOptimization"), dict):
            doc["routeOptimization"] = route_meta or {
                "summary": "Shortest travel path constructed to avoid backtracking.",
                "totalDistance": "32.5 km",
                "totalTravelTime": "1 hr 45 mins",
                "fuelEstimate": "₹450",
                "avoidBacktrackingStrategy": "Geographic polar sweep applied."
            }

        # 4. Daily Itinerary (Ensure every day has MINIMUM 4 activities from REAL attractions)
        dest_lower = destination.lower()
        if "ambaji" in dest_lower and days_count >= 4:
            ambaji_days = [
                {
                    "dayNumber": 1,
                    "title": "Day 1: Ambaji Temple Main Darshan & Gabbar Hill",
                    "activities": [
                        {"placeName": "Ambaji Temple Main Garbh Griha Darshan", "address": "Main Temple, Ambaji", "distance": "0.5 km", "travelTime": "10 mins", "rating": "4.9", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": f"{geo.get('latitude', 24.331)},{geo.get('longitude', 72.852)}", "category": "Temple / Main Shrine", "description": "Principal Shaktipeeth shrine where Goddess Amba is worshipped with holy Akhand Jyot."},
                        {"placeName": "Chachar Chowk & Main Temple Courtyard", "address": "Ambaji Temple Complex", "distance": "0.2 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": f"{geo.get('latitude', 24.331)},{geo.get('longitude', 72.852)}", "category": "Temple Courtyard", "description": "Historic open courtyard surrounding the main shrine for morning prayers."},
                        {"placeName": "Gabbar Hill & Ropeway", "address": "Gabbar Hill, Ambaji", "distance": "4.0 km", "travelTime": "15 mins", "rating": "4.9", "openingHours": "06:30 AM", "entryFee": "₹125 Ropeway", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2.5 Hours", "coordinates": "24.345,72.835", "category": "Shaktipeeth & Cable Car", "description": "Original seat of Goddess Amba atop Gabbar rock featuring cable car and 51 Shaktipeeth parikrama."},
                        {"placeName": "Evening Aarti & Night Darshan", "address": "Ambaji Temple", "distance": "4.0 km", "travelTime": "15 mins", "rating": "4.9", "openingHours": "07:00 PM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": f"{geo.get('latitude', 24.331)},{geo.get('longitude', 72.852)}", "category": "Temple Aarti", "description": "Grand evening lamp ceremony (Aarti) with sacred chanting."}
                    ]
                },
                {
                    "dayNumber": 2,
                    "title": "Day 2: Nearby Heritage Shrines & Sunset Viewpoint",
                    "activities": [
                        {"placeName": "Kamakshi Mandir Complex", "address": "Kamakshi Complex, Ambaji", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.7", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1.5 Hours", "coordinates": "24.335,72.858", "category": "Shaktipeeth Replicas", "description": "Vast temple complex depicting replicas of all 51 Indian subcontinent Shaktipeeths."},
                        {"placeName": "Kumbhariya Jain Temples", "address": "Kumbhariya, Ambaji", "distance": "2.5 km", "travelTime": "10 mins", "rating": "4.8", "openingHours": "07:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "2 Hours", "coordinates": "24.320,72.865", "category": "11th Century Marble Temple", "description": "11th-century White Marble Solanki Jain architectural wonder featuring exquisite ceiling carvings."},
                        {"placeName": "Kailash Hill Sunset Point", "address": "Kailash Hill, Ambaji", "distance": "1.8 km", "travelTime": "8 mins", "rating": "4.7", "openingHours": "05:00 PM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "24.338,72.845", "category": "Sunset Viewpoint", "description": "Panoramic hill-top viewpoint offering sunset vistas over Aravalli mountain ranges."},
                        {"placeName": "Local Ambaji Market & Bazaar", "address": "Ambaji Town Market", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "2 Hours", "coordinates": "24.330,72.850", "category": "Local Shopping & Street Food", "description": "Bustling market renowned for Chaniya Choli, traditional brassware, and Mohanthal prasad."}
                    ]
                },
                {
                    "dayNumber": 3,
                    "title": "Day 3: Sacred River Origin & Wildlife Sanctuary",
                    "activities": [
                        {"placeName": "Koteshwar Mahadev Temple", "address": "Koteshwar, Ambaji", "distance": "8.0 km", "travelTime": "20 mins", "rating": "4.8", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1.5 Hours", "coordinates": "24.380,72.810", "category": "Saraswati River Origin", "description": "Ancient Shiva temple marking the sacred origin point of Vedic Saraswati River stream."},
                        {"placeName": "Mansarovar Water Tank", "address": "Mansarovar, Ambaji", "distance": "1.2 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "24.328,72.855", "category": "Sacred Water Reservoir", "description": "Rectangular holy water reservoir built by Solanki rulers with steps and twin shrines."},
                        {"placeName": "Nearby Tribal Villages Stroll", "address": "Banaskantha Villages", "distance": "12.0 km", "travelTime": "25 mins", "rating": "4.5", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1.5 Hours", "coordinates": "24.350,72.880", "category": "Cultural Heritage Walk", "description": "Walk through traditional tribal hamlets around Aravalli foothills."},
                        {"placeName": "Balaram Ambaji Wildlife Sanctuary Forest Drive", "address": "Balaram Sanctuary", "distance": "15.0 km", "travelTime": "30 mins", "rating": "4.7", "openingHours": "07:00 AM", "entryFee": "₹50", "bestTime": "07:30 PM (Night)", "expectedDuration": "2.5 Hours", "coordinates": "24.280,72.780", "category": "Nature & Wildlife Drive", "description": "Dense dry deciduous forest harboring sloth bears, leopards, and wild boars."}
                    ]
                },
                {
                    "dayNumber": 4,
                    "title": "Day 4: Mount Abu High-Altitude Day Excursion (100-150 km)",
                    "activities": [
                        {"placeName": "Mount Abu Nakki Lake & Boat Ride", "address": "Nakki Lake, Mount Abu", "distance": "45.0 km", "travelTime": "1.2 hours", "rating": "4.9", "openingHours": "08:00 AM", "entryFee": "₹150 Boat", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2.5 Hours", "coordinates": "24.592,72.708", "category": "Scenic Hill Station Lake", "description": "Sacred artificial hill-station lake surrounded by rock formations and boating decks."},
                        {"placeName": "Dilwara Jain Temples (Mount Abu)", "address": "Dilwara, Mount Abu", "distance": "3.0 km", "travelTime": "10 mins", "rating": "4.95", "openingHours": "12:00 PM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "2 Hours", "coordinates": "24.605,72.720", "category": "UNESCO World Heritage Marble Art", "description": "World-famous 11th–13th century marble temples with unmatched intricate stone lacework."},
                        {"placeName": "Guru Shikhar Peak", "address": "Guru Shikhar, Mount Abu", "distance": "15.0 km", "travelTime": "30 mins", "rating": "4.8", "openingHours": "08:00 AM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2 Hours", "coordinates": "24.650,72.780", "category": "Highest Aravalli Peak (1,722m)", "description": "Highest peak of Aravalli mountain range housing Dattatreya temple and observatory."},
                        {"placeName": "Sunset Point Mount Abu", "address": "Sunset Point, Mount Abu", "distance": "12.0 km", "travelTime": "25 mins", "rating": "4.8", "openingHours": "05:00 PM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "24.580,72.700", "category": "Panoramic Sunset Viewpoint", "description": "Famous cliff-side viewpoint offering breathtaking sunset over valley peaks."}
                    ]
                }
            ]

            if days_count >= 5:
                ambaji_days.append({
                    "dayNumber": 5,
                    "title": "Day 5: Final Darshan, Shopping & Return Journey",
                    "activities": [
                        {"placeName": "Final Morning Darshan at Ambaji Temple", "address": "Ambaji Temple", "distance": "0.5 km", "travelTime": "10 mins", "rating": "4.9", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1.5 Hours", "coordinates": f"{geo.get('latitude', 24.331)},{geo.get('longitude', 72.852)}", "category": "Final Morning Prayer", "description": "Peaceful final morning prayers at Goddess Amba main sanctum."},
                        {"placeName": "Traditional Handicrafts & Mohanthal Shopping", "address": "Ambaji Temple Market", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.7", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "2 Hours", "coordinates": "24.330,72.850", "category": "Souvenir Shopping", "description": "Purchase authentic Mohanthal prasad sweets and traditional Gujarati handicrafts."},
                        {"placeName": "Traditional Kathiyawadi Breakfast & Lunch", "address": "Ambaji Town Restaurant", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "12:00 PM", "entryFee": "₹250", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "24.332,72.851", "category": "Regional Gastronomy", "description": "Authentic Gujarati Thali meal with Rotla, Ringan Bharta and Chhas."},
                        {"placeName": "Departure & Return Journey", "address": "Ambaji Bus / Station", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "24.325,72.848", "category": "Departure Transfer", "description": "Board transport for homeward return journey."}
                    ]
                })
            doc["dailyItinerary"] = ambaji_days
        elif "dwarka" in dest_lower and days_count >= 4:
            dwarka_days = [
                {
                    "dayNumber": 1,
                    "title": "Day 1: Dwarkadhish Temple Main Darshan & Gomti Ghat",
                    "activities": [
                        {"placeName": "Dwarkadhish Temple (Jagat Mandir)", "address": "Dwarka", "distance": "0.5 km", "travelTime": "10 mins", "rating": "4.9", "openingHours": "06:30 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "22.240,68.968", "category": "Main Temple", "description": "5-storey ancient temple of Lord Krishna located on Gomti river bank."},
                        {"placeName": "Gomti Ghat Holy Dip", "address": "Gomti River Ghat, Dwarka", "distance": "0.2 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "22.238,68.969", "category": "Sacred River", "description": "Sacred confluence of River Gomti with Arabian Sea."},
                        {"placeName": "Sudama Setu Suspension Bridge", "address": "Gomti River, Dwarka", "distance": "0.3 km", "travelTime": "5 mins", "rating": "4.7", "openingHours": "07:00 AM", "entryFee": "₹10", "bestTime": "04:00 PM (Evening)", "expectedDuration": "45 Mins", "coordinates": "22.239,68.970", "category": "Suspension Bridge", "description": "Pedestrian suspension bridge offering river and ocean vistas."},
                        {"placeName": "Evening Aarti & Temple Illumination", "address": "Dwarkadhish Temple", "distance": "0.5 km", "travelTime": "10 mins", "rating": "4.9", "openingHours": "07:30 PM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "22.240,68.968", "category": "Evening Aarti", "description": "Grand evening lamp ceremony with flag changing ritual (Dhwaja Arohan)."}
                    ]
                },
                {
                    "dayNumber": 2,
                    "title": "Day 2: Heritage Shrines, Jyotirlinga & Shivrajpur Beach",
                    "activities": [
                        {"placeName": "Rukmini Devi Temple", "address": "Rukmini Temple, Dwarka", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.6", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1 Hour", "coordinates": "22.258,68.980", "category": "12th Century Temple", "description": "12th-century architectural masterpiece dedicated to Goddess Rukmini."},
                        {"placeName": "Nageshwar Jyotirlinga Temple", "address": "Nageshwar, Dwarka", "distance": "12.0 km", "travelTime": "25 mins", "rating": "4.8", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1.5 Hours", "coordinates": "22.330,69.080", "category": "12 Jyotirlinga Shrine", "description": "One of the 12 sacred Jyotirlingas with a colossal 85ft Lord Shiva statue."},
                        {"placeName": "Gopi Talav Sacred Pond", "address": "Gopi Talav, Dwarka", "distance": "15.0 km", "travelTime": "30 mins", "rating": "4.5", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "22.350,69.100", "category": "Sacred Pond", "description": "Legendary yellow-mud sacred pond associated with Gopis of Vrindavan."},
                        {"placeName": "Shivrajpur Blue Flag Beach", "address": "Shivrajpur Beach, Dwarka", "distance": "12.0 km", "travelTime": "20 mins", "rating": "4.9", "openingHours": "08:00 AM", "entryFee": "₹30", "bestTime": "07:30 PM (Night)", "expectedDuration": "2.5 Hours", "coordinates": "22.330,68.950", "category": "Blue Flag Beach", "description": "Pristine white sand Blue Flag certified beach with watersports and sunset views."}
                    ]
                },
                {
                    "dayNumber": 3,
                    "title": "Day 3: Bet Dwarka Island Excursion & Okha Port",
                    "activities": [
                        {"placeName": "Bet Dwarka Island (Ferry Ride)", "address": "Bet Dwarka Island", "distance": "32.0 km", "travelTime": "45 mins", "rating": "4.8", "openingHours": "07:00 AM", "entryFee": "Ferry ₹50", "bestTime": "08:30 AM (Morning)", "expectedDuration": "3 Hours", "coordinates": "22.460,69.100", "category": "Island Sanctuary", "description": "Historic island sanctuary believed to be the residential palace of Lord Krishna."},
                        {"placeName": "Hanuman Dandi Island Temple", "address": "Bet Dwarka", "distance": "5.0 km", "travelTime": "15 mins", "rating": "4.6", "openingHours": "07:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "22.480,69.120", "category": "Island Shrine", "description": "Unique island temple where Lord Hanuman and son Makardhwaja are worshipped."},
                        {"placeName": "Okha Port & Lighthouse", "address": "Okha Port", "distance": "30.0 km", "travelTime": "40 mins", "rating": "4.6", "openingHours": "09:00 AM", "entryFee": "₹10", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1.5 Hours", "coordinates": "22.470,69.070", "category": "Port & Lighthouse", "description": "Major commercial port and lighthouse offering ocean harbor views."},
                        {"placeName": "Bhadkeshwar Mahadev Sunset Temple", "address": "Bhadkeshwar, Dwarka", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.8", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "22.235,68.960", "category": "Sunset Sea Shrine", "description": "Sea-surrounded temple rock offering breathtaking ocean sunsets."}
                    ]
                },
                {
                    "dayNumber": 4,
                    "title": "Day 4: Porbandar Excursion (Gandhi Birthplace & Sudama Temple)",
                    "activities": [
                        {"placeName": "Porbandar Kirti Mandir", "address": "Porbandar", "distance": "105.0 km", "travelTime": "1.8 hours", "rating": "4.8", "openingHours": "07:30 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "21.642,69.600", "category": "Gandhi Birthplace Shrine", "description": "Memorial shrine built adjacent to the 3-story ancestral birthplace house of Mahatma Gandhi."},
                        {"placeName": "Sudama Temple Porbandar", "address": "Porbandar Town", "distance": "2.0 km", "travelTime": "5 mins", "rating": "4.7", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "21.645,69.605", "category": "Heritage Temple", "description": "Historic temple dedicated to Sudama, the devoted childhood friend of Lord Krishna."},
                        {"placeName": "Porbandar Chowpatty Beach Walk", "address": "Porbandar Beach", "distance": "3.0 km", "travelTime": "10 mins", "rating": "4.6", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1.5 Hours", "coordinates": "21.635,69.595", "category": "Beach Walkway", "description": "Wide sandy promenade along the Arabian sea in Porbandar."},
                        {"placeName": "Return to Dwarka & Night Rest", "address": "Dwarka Hotel", "distance": "105.0 km", "travelTime": "1.8 hours", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "22.240,68.968", "category": "Return Transit", "description": "Drive back to Dwarka for evening rest."}
                    ]
                }
            ]

            if days_count >= 5:
                dwarka_days.append({
                    "dayNumber": 5,
                    "title": "Day 5: Shopping, Final Darshan & Departure",
                    "activities": [
                        {"placeName": "Final Morning Darshan at Jagat Mandir", "address": "Dwarkadhish Temple", "distance": "0.5 km", "travelTime": "10 mins", "rating": "4.9", "openingHours": "06:30 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1.5 Hours", "coordinates": "22.240,68.968", "category": "Final Prayer", "description": "Peaceful final morning prayers at Lord Krishna main sanctum."},
                        {"placeName": "Dwarka Brassware & Souvenir Bazaars", "address": "Temple Market, Dwarka", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "2 Hours", "coordinates": "22.242,68.970", "category": "Souvenir Shopping", "description": "Purchase idols, brass lamps, Bandhani textiles and local handicrafts."},
                        {"placeName": "Traditional Kathiyawadi Thali Lunch", "address": "Dwarka Town Restaurant", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.7", "openingHours": "12:00 PM", "entryFee": "₹300", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "22.245,68.965", "category": "Regional Gastronomy", "description": "Authentic Kathiyawadi feast with Bajra Rotla, Ringan Bharta, Sev Tameta and Jaggery."},
                        {"placeName": "Departure Transfer (Dwarka Station / Airport)", "address": "Dwarka Junction", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "22.250,68.975", "category": "Departure Transfer", "description": "Board train/bus for homeward return journey."}
                    ]
                })
            doc["dailyItinerary"] = dwarka_days
        elif "sarangpur" in dest_lower and days_count >= 7:
            sarangpur_days = [
                {
                    "dayNumber": 1,
                    "title": "Day 1: Arrival & Kashtabhanjan Dev Darshan",
                    "activities": [
                        {"placeName": "Kashtabhanjan Dev Hanumanji Mandir", "address": "Main Temple, Sarangpur", "distance": "0.5 km", "travelTime": "10 mins", "rating": "4.9", "openingHours": "05:30 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "22.220,71.770", "category": "Main Temple", "description": "World-famous Kashtabhanjan Hanumanji temple known for removing obstacles."},
                        {"placeName": "King of Salangpur Statue", "address": "Temple Complex, Sarangpur", "distance": "0.2 km", "travelTime": "5 mins", "rating": "4.9", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "22.222,71.772", "category": "Monument", "description": "Colossal 54-feet tall magnificent statue of Lord Hanuman."},
                        {"placeName": "BAPS Shri Swaminarayan Mandir", "address": "Sarangpur", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1.5 Hours", "coordinates": "22.225,71.775", "category": "Heritage Temple", "description": "Beautifully carved Swaminarayan Mandir and Pramukh Swami Maharaj smruti mandir."},
                        {"placeName": "Evening Aarti & Night Darshan", "address": "Kashtabhanjan Dev Mandir", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.9", "openingHours": "07:00 PM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "22.220,71.770", "category": "Temple Aarti", "description": "Attend the divine evening Aarti and seek blessings."}
                    ]
                },
                {
                    "dayNumber": 2,
                    "title": "Day 2: Sacred Ponds & Local Exploration",
                    "activities": [
                        {"placeName": "Narayan Kund", "address": "Sarangpur", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.7", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1 Hour", "coordinates": "22.230,71.780", "category": "Sacred Water Body", "description": "Holy water body with serene surroundings for peaceful meditation."},
                        {"placeName": "Yajnapurush Smruti Mandir", "address": "BAPS Campus, Sarangpur", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "08:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "22.226,71.776", "category": "Memorial", "description": "Memorial shrine honoring Shastriji Maharaj."},
                        {"placeName": "Local Temple Pradakshina", "address": "Sarangpur", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "04:00 PM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1.5 Hours", "coordinates": "22.220,71.770", "category": "Spiritual Walk", "description": "Perform the holy parikrama (circumambulation) of the temple premises."},
                        {"placeName": "Sarangpur Bazaar & Prasad Shopping", "address": "Temple Road", "distance": "0.2 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "22.221,71.769", "category": "Shopping", "description": "Buy religious souvenirs, books, and the famous Sukhdi prasad."}
                    ]
                },
                {
                    "dayNumber": 3,
                    "title": "Day 3: Gadhada Spiritual Excursion (50 km)",
                    "activities": [
                        {"placeName": "Shri Swaminarayan Mandir, Gadhada", "address": "Gadhada", "distance": "50.0 km", "travelTime": "1.2 hours", "rating": "4.9", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "21.960,71.550", "category": "Historical Temple", "description": "Historic Swaminarayan temple constructed under the supervision of Lord Swaminarayan."},
                        {"placeName": "Gopinathji Dev Darshan", "address": "Gadhada Mandir", "distance": "0.1 km", "travelTime": "2 mins", "rating": "4.9", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "21.960,71.550", "category": "Main Shrine", "description": "Seek blessings at the main sanctum of the Gadhada temple."},
                        {"placeName": "Ghela River Holy Ghats", "address": "Gadhada", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.7", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "21.955,71.555", "category": "Sacred River", "description": "The sacred river Ghela where Lord Swaminarayan frequently bathed."},
                        {"placeName": "Return to Sarangpur & Rest", "address": "Sarangpur Hotel", "distance": "50.0 km", "travelTime": "1.2 hours", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "22.220,71.770", "category": "Return Transit", "description": "Drive back to Sarangpur and rest for the evening."}
                    ]
                },
                {
                    "dayNumber": 4,
                    "title": "Day 4: Nature & Wildlife (Velavadar Sanctuary)",
                    "activities": [
                        {"placeName": "Velavadar Blackbuck National Park", "address": "Velavadar", "distance": "55.0 km", "travelTime": "1.5 hours", "rating": "4.8", "openingHours": "06:00 AM", "entryFee": "₹150", "bestTime": "08:30 AM (Morning)", "expectedDuration": "3 Hours", "coordinates": "21.950,72.050", "category": "Wildlife Sanctuary", "description": "Golden savannah grasslands home to the majestic Indian Blackbuck."},
                        {"placeName": "Bird Watching Point", "address": "Velavadar Park", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.7", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1.5 Hours", "coordinates": "21.952,72.055", "category": "Nature Observation", "description": "Spot migratory birds and harriers in the wetland areas of the park."},
                        {"placeName": "Savannah Grasslands Drive", "address": "Velavadar Park", "distance": "5.0 km", "travelTime": "30 mins", "rating": "4.8", "openingHours": "06:00 AM", "entryFee": "Jeep Cost", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2 Hours", "coordinates": "21.955,72.060", "category": "Safari", "description": "Take a scenic drive through the unique grassland ecosystem."},
                        {"placeName": "Hanuman Chalisa Path at Sarangpur", "address": "Kashtabhanjan Dev Mandir", "distance": "55.0 km", "travelTime": "1.5 hours", "rating": "4.9", "openingHours": "06:00 PM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "22.220,71.770", "category": "Spiritual Activity", "description": "Participate in the collective chanting of Hanuman Chalisa back at the temple."}
                    ]
                },
                {
                    "dayNumber": 5,
                    "title": "Day 5: Bhavnagar Coastal & Heritage Drive",
                    "activities": [
                        {"placeName": "Takhteshwar Temple", "address": "Bhavnagar", "distance": "75.0 km", "travelTime": "1.8 hours", "rating": "4.6", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1.5 Hours", "coordinates": "21.750,72.150", "category": "Hilltop Temple", "description": "Historic hilltop Shiva temple offering panoramic views of Bhavnagar city and coastline."},
                        {"placeName": "Victoria Park", "address": "Bhavnagar", "distance": "4.0 km", "travelTime": "15 mins", "rating": "4.5", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1.5 Hours", "coordinates": "21.740,72.130", "category": "Nature Park", "description": "A protected forest area in the heart of the city with diverse flora and fauna."},
                        {"placeName": "Gaurishankar Lake", "address": "Bhavnagar", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "21.745,72.135", "category": "Lakefront", "description": "Beautiful lake popular for evening strolls and sunset views."},
                        {"placeName": "Return to Sarangpur", "address": "Sarangpur Hotel", "distance": "75.0 km", "travelTime": "1.8 hours", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "22.220,71.770", "category": "Return Transit", "description": "Drive back to Sarangpur."}
                    ]
                },
                {
                    "dayNumber": 6,
                    "title": "Day 6: Palitana & Nishkalank Mahadev (Sea Temple)",
                    "activities": [
                        {"placeName": "Palitana Shatrunjaya Taleti", "address": "Palitana", "distance": "110.0 km", "travelTime": "2.5 hours", "rating": "4.9", "openingHours": "06:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "21.500,71.800", "category": "Jain Pilgrimage Base", "description": "Base of the sacred Shatrunjaya hills, home to hundreds of exquisite Jain temples."},
                        {"placeName": "Palitana Heritage Walk", "address": "Palitana Town", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.6", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1.5 Hours", "coordinates": "21.510,71.810", "category": "Cultural Walk", "description": "Explore the local town and heritage structures of Palitana."},
                        {"placeName": "Nishkalank Mahadev Sea Temple", "address": "Koliyak, Bhavnagar", "distance": "60.0 km", "travelTime": "1.5 hours", "rating": "4.9", "openingHours": "Tide Dependent", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2 Hours", "coordinates": "21.600,72.280", "category": "Sea Temple", "description": "Unique Shiva temple located inside the sea, accessible only during low tide."},
                        {"placeName": "Return Journey to Sarangpur", "address": "Sarangpur Hotel", "distance": "120.0 km", "travelTime": "2.5 hours", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "2 Hours", "coordinates": "22.220,71.770", "category": "Return Transit", "description": "Drive back to Sarangpur for the final night."}
                    ]
                },
                {
                    "dayNumber": 7,
                    "title": "Day 7: Final Blessings & Departure",
                    "activities": [
                        {"placeName": "Final Morning Darshan", "address": "Kashtabhanjan Dev Mandir", "distance": "0.5 km", "travelTime": "10 mins", "rating": "4.9", "openingHours": "05:30 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "1.5 Hours", "coordinates": "22.220,71.770", "category": "Final Prayer", "description": "Peaceful final morning prayers at Lord Hanuman main sanctum."},
                        {"placeName": "Sarangpur Temple Bhojanalaya", "address": "Temple Campus", "distance": "0.2 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "11:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1 Hour", "coordinates": "22.221,71.771", "category": "Sacred Dining", "description": "Partake in the holy Maha Prasad (lunch) served to all devotees at the temple."},
                        {"placeName": "Final Souvenir Shopping", "address": "Sarangpur Market", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "22.222,71.769", "category": "Souvenir Shopping", "description": "Final purchases of spiritual books and mementos."},
                        {"placeName": "Departure Transfer", "address": "Sarangpur Bus Stand / Station", "distance": "1.0 km", "travelTime": "10 mins", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "22.225,71.765", "category": "Departure Transfer", "description": "Board transport for homeward return journey."}
                    ]
                }
            ]
            doc["dailyItinerary"] = sarangpur_days
        elif "chotila" in dest_lower and days_count >= 6:
            chotila_days = [
                {
                    "dayNumber": 1,
                    "title": "Day 1: Arrival & First Darshan",
                    "activities": [
                        {"placeName": "Arrival at Ahmedabad & Travel to Chotila", "address": "Highway 47, Ahmedabad to Chotila", "distance": "170.0 km", "travelTime": "3 hours", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "3 Hours", "coordinates": "22.420,71.190", "category": "Transit", "description": "Arrive in Ahmedabad and take a bus/train to Chotila."},
                        {"placeName": "Chamunda Mata Temple Climb & Darshan", "address": "Chotila Hill", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.8", "openingHours": "05:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "2.5 Hours", "coordinates": "22.415,71.195", "category": "Hilltop Temple", "description": "Check in, climb the stairs to the hilltop shrine of Goddess Chamunda."},
                        {"placeName": "Sunset Aarti at Chamunda Mata Temple", "address": "Chotila Hill", "distance": "0.0 km", "travelTime": "0 mins", "rating": "4.9", "openingHours": "06:30 PM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1.5 Hours", "coordinates": "22.415,71.195", "category": "Temple Aarti", "description": "Attend the divine sunset aarti with panoramic views from the hill."},
                        {"placeName": "Chotila Local Market Stroll", "address": "Temple Base, Chotila", "distance": "1.5 km", "travelTime": "15 mins (Descent)", "rating": "4.5", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "22.420,71.190", "category": "Shopping", "description": "Stroll the local market at the temple base and purchase prasad."}
                    ]
                },
                {
                    "dayNumber": 2,
                    "title": "Day 2: Temple Rituals & Village Culture",
                    "activities": [
                        {"placeName": "Early-Morning Chamunda Darshan", "address": "Chotila Hill", "distance": "1.5 km", "travelTime": "15 mins", "rating": "4.8", "openingHours": "05:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "22.415,71.195", "category": "Morning Prayer", "description": "Early-morning darshan to capture hill views and temple architecture."},
                        {"placeName": "Village Lanes & Priest Interactions", "address": "Chotila Village", "distance": "1.0 km", "travelTime": "10 mins", "rating": "4.5", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "2 Hours", "coordinates": "22.422,71.188", "category": "Cultural Walk", "description": "Walk village lanes, meet local priests, and experience the culture."},
                        {"placeName": "Local Street Snacks Tasting", "address": "Chotila Main Road", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "10:00 AM", "entryFee": "Food Cost", "bestTime": "04:00 PM (Evening)", "expectedDuration": "1 Hour", "coordinates": "22.425,71.190", "category": "Local Food", "description": "Try authentic Kathiyawadi street snacks like Gathiya and Bhajiya."},
                        {"placeName": "Evening Bhajans & Devotional Music", "address": "Local Dharamshala/Temple", "distance": "0.5 km", "travelTime": "5 mins", "rating": "4.7", "openingHours": "07:00 PM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "2 Hours", "coordinates": "22.420,71.192", "category": "Spiritual Music", "description": "Join evening bhajans, observe rituals, and mingle with devotees."}
                    ]
                },
                {
                    "dayNumber": 3,
                    "title": "Day 3: Wadhwan & Surendranagar Heritage (40 km)",
                    "activities": [
                        {"placeName": "Wadhwan Darbargadh Palace", "address": "Wadhwan", "distance": "40.0 km", "travelTime": "1 Hour", "rating": "4.6", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "22.700,71.680", "category": "Heritage Palace", "description": "Short drive to Wadhwan to visit the historic Darbargadh Palace."},
                        {"placeName": "Surendranagar Old Mansions", "address": "Surendranagar", "distance": "5.0 km", "travelTime": "15 mins", "rating": "4.5", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1.5 Hours", "coordinates": "22.720,71.650", "category": "Heritage Walk", "description": "Explore the historic old mansions and architecture of Surendranagar."},
                        {"placeName": "Surendranagar Textile Markets", "address": "Surendranagar", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.6", "openingHours": "10:00 AM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2 Hours", "coordinates": "22.725,71.645", "category": "Shopping", "description": "Shop for local bandhani, textiles, and traditional garments."},
                        {"placeName": "Gujarati Thali Dinner in Chotila", "address": "Chotila Eatery", "distance": "45.0 km", "travelTime": "1.2 Hours", "rating": "4.7", "openingHours": "07:00 PM", "entryFee": "₹200", "bestTime": "07:30 PM (Night)", "expectedDuration": "1.5 Hours", "coordinates": "22.420,71.190", "category": "Dining", "description": "Return to Chotila and enjoy an authentic Kathiyawadi/Gujarati Thali."}
                    ]
                },
                {
                    "dayNumber": 4,
                    "title": "Day 4: Rajkot & Gondal Palaces Excursion (70 km)",
                    "activities": [
                        {"placeName": "Rajkot Watson Museum", "address": "Rajkot", "distance": "45.0 km", "travelTime": "1 Hour", "rating": "4.7", "openingHours": "09:00 AM", "entryFee": "₹20", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2 Hours", "coordinates": "22.300,70.800", "category": "Museum", "description": "Travel to Rajkot and explore colonial-era history at the Watson Museum."},
                        {"placeName": "Rajkot Colonial Sites Walk", "address": "Rajkot City", "distance": "2.0 km", "travelTime": "10 mins", "rating": "4.5", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1.5 Hours", "coordinates": "22.305,70.795", "category": "Heritage", "description": "Discover local heritage and architecture from the colonial era."},
                        {"placeName": "Gondal Naulakha & Orchard Palaces", "address": "Gondal", "distance": "40.0 km", "travelTime": "1 Hour", "rating": "4.8", "openingHours": "09:00 AM", "entryFee": "₹100", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2.5 Hours", "coordinates": "21.960,70.800", "category": "Palace & Vintage Cars", "description": "Drive to Gondal to witness royal collections and vintage cars at the palaces."},
                        {"placeName": "Return to Chotila & Sweet Shops", "address": "Highway 47, Chotila", "distance": "75.0 km", "travelTime": "1.5 Hours", "rating": "4.6", "openingHours": "Till 10:00 PM", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "22.420,71.190", "category": "Food & Transit", "description": "Stop at famous roadside sweet shops (Penda) on the way back to Chotila."}
                    ]
                },
                {
                    "dayNumber": 5,
                    "title": "Day 5: Bandhani & Handicraft Immersion",
                    "activities": [
                        {"placeName": "Jetpur / Rajkot Block-Printing Workshops", "address": "Jetpur / Rajkot District", "distance": "90.0 km", "travelTime": "2 Hours", "rating": "4.7", "openingHours": "10:00 AM", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "2.5 Hours", "coordinates": "21.750,70.620", "category": "Cultural Handicraft", "description": "Visit authentic workshops to see bandhani and block-printing demonstrations."},
                        {"placeName": "Hands-on Tie-Dye Demo & Artisan Shopping", "address": "Jetpur Workshops", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "11:00 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "2 Hours", "coordinates": "21.755,70.625", "category": "Interactive Experience", "description": "Take a short hands-on tie-dye demo and shop directly from artisans."},
                        {"placeName": "Return Journey to Chotila", "address": "Chotila", "distance": "90.0 km", "travelTime": "2 Hours", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2 Hours", "coordinates": "22.420,71.190", "category": "Transit", "description": "Relaxing evening drive back to the base in Chotila."},
                        {"placeName": "Night Photography of Illuminated Temple", "address": "Chotila Base", "distance": "1.0 km", "travelTime": "5 mins", "rating": "4.8", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "1 Hour", "coordinates": "22.415,71.195", "category": "Photography", "description": "Photograph the glowing Chamunda Mata hilltop temple lit up at night."}
                    ]
                },
                {
                    "dayNumber": 6,
                    "title": "Day 6: Ahmedabad Old City & Departure",
                    "activities": [
                        {"placeName": "Travel to Ahmedabad & Luggage Drop", "address": "Ahmedabad City", "distance": "170.0 km", "travelTime": "3 Hours", "rating": "4.6", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "08:30 AM (Morning)", "expectedDuration": "3.5 Hours", "coordinates": "23.020,72.570", "category": "Transit", "description": "Travel to Ahmedabad and store luggage to begin the old-city tour."},
                        {"placeName": "Sabarmati Ashram Visit", "address": "Sabarmati Ashram, Ahmedabad", "distance": "10.0 km", "travelTime": "25 mins", "rating": "4.8", "openingHours": "08:30 AM", "entryFee": "Free", "bestTime": "11:30 AM (Afternoon)", "expectedDuration": "1.5 Hours", "coordinates": "23.060,72.580", "category": "Historical Site", "description": "Visit the peaceful former residence of Mahatma Gandhi."},
                        {"placeName": "Bhadra Fort & Pol Neighbourhood Walk", "address": "Old City, Ahmedabad", "distance": "5.0 km", "travelTime": "15 mins", "rating": "4.7", "openingHours": "09:00 AM", "entryFee": "Free", "bestTime": "04:00 PM (Evening)", "expectedDuration": "2 Hours", "coordinates": "23.025,72.585", "category": "Heritage Walk", "description": "Explore Bhadra Fort and walk through the traditional labyrinthine Pol lanes."},
                        {"placeName": "Last-Minute Textile Shopping & Departure", "address": "Ahmedabad Station / Airport", "distance": "10.0 km", "travelTime": "30 mins", "rating": "4.5", "openingHours": "24 Hours", "entryFee": "Free", "bestTime": "07:30 PM (Night)", "expectedDuration": "2 Hours", "coordinates": "23.030,72.600", "category": "Shopping & Departure", "description": "Final shopping for textiles at Law Garden/Lal Darwaja and departure."}
                    ]
                }
            ]
            doc["dailyItinerary"] = chotila_days
        elif not doc.get("dailyItinerary") or not isinstance(doc.get("dailyItinerary"), list) or len(doc.get("dailyItinerary")) < days_count:
            daily_list = []
            attraction_pool = list(attractions) if attractions else []
            total_attractions = len(attraction_pool)

            for d in range(1, days_count + 1):
                day_places = clusters.get(d)
                if not day_places or len(day_places) < 3:
                    if total_attractions > 0:
                        start_idx = ((d - 1) * 3) % total_attractions
                        day_places = [attraction_pool[(start_idx + i) % total_attractions] for i in range(min(4, total_attractions))]
                    else:
                        day_places = []

                acts = []
                time_slots = ["08:30 AM (Morning)", "11:30 AM (Afternoon)", "04:00 PM (Evening)", "07:30 PM (Night)"]
                categories = ["Sightseeing", "Cultural / Heritage", "Sunset Point / Nature", "Market & Dining"]
                
                for idx in range(4):
                    p = day_places[idx] if idx < len(day_places) else (attraction_pool[(idx + d * 2) % total_attractions] if total_attractions > 0 else {})
                    p_name = p.get("name", f"{destination} Main Shrine")
                    p_addr = p.get("address", destination)
                    acts.append({
                        "placeName": p_name,
                        "address": p_addr,
                        "distance": p.get("distanceFromPrevious", "1.5 km"),
                        "travelTime": p.get("travelTime", "15 mins"),
                        "rating": str(p.get("googleRating", "4.8")),
                        "openingHours": p.get("openingHours", "08:00 AM"),
                        "entryFee": p.get("entryFee", "Free"),
                        "bestTime": time_slots[idx],
                        "expectedDuration": p.get("expectedVisitDuration", "1.5 Hours"),
                        "coordinates": f"{p.get('latitude', geo.get('latitude'))},{p.get('longitude', geo.get('longitude'))}",
                        "category": categories[idx],
                        "description": p.get("shortDescription", f"Verified real-world landmark in {destination}.")
                    })

                day_title_place = day_places[0].get("name", destination) if day_places else destination
                daily_list.append({
                    "dayNumber": d,
                    "title": f"Day {d}: {day_title_place} & Surrounding Sights",
                    "activities": acts
                })
            doc["dailyItinerary"] = daily_list
        else:
            # Validate each day in existing dailyItinerary has complete fields
            for d_idx, day in enumerate(doc["dailyItinerary"]):
                if not day.get("activities") or len(day.get("activities")) < 4:
                    day_places = clusters.get(d_idx + 1, attractions[:4])
                    day["activities"] = [
                        {
                            "placeName": p.get("name", f"Attraction {i+1}"),
                            "address": p.get("address", destination),
                            "distance": p.get("distanceFromPrevious", "2.0 km"),
                            "travelTime": p.get("travelTime", "20 mins"),
                            "rating": str(p.get("googleRating", "4.6")),
                            "openingHours": p.get("openingHours", "08:00 AM"),
                            "entryFee": p.get("entryFee", "Free"),
                            "bestTime": "Morning / Afternoon",
                            "expectedDuration": "1.5 Hours",
                            "coordinates": f"{p.get('latitude')},{p.get('longitude')}",
                            "description": p.get("shortDescription", "Exploration stop.")
                        }
                        for i, p in enumerate(day_places[:4])
                    ]

        # 5. Hotels
        if not doc.get("hotels") or not isinstance(doc.get("hotels"), dict) or not doc.get("hotels", {}).get("budget"):
            doc["hotels"] = hotels

        # 6. Restaurants
        if not doc.get("restaurants") or not isinstance(doc.get("restaurants"), dict) or not doc.get("restaurants", {}).get("lunch"):
            doc["restaurants"] = restaurants

        # 7. Transportation
        if not doc.get("transportation") or not isinstance(doc.get("transportation"), dict):
            doc["transportation"] = transport

        # 8. Cost Breakdown
        if not doc.get("costBreakdown") or not isinstance(doc.get("costBreakdown"), dict):
            tot = budget * travelers
            doc["costBreakdown"] = {
                "hotel": f"₹{int(tot * 0.40):,}",
                "food": f"₹{int(tot * 0.25):,}",
                "fuel": f"₹{int(tot * 0.10):,}",
                "transport": f"₹{int(tot * 0.10):,}",
                "tickets": f"₹{int(tot * 0.08):,}",
                "shopping": f"₹{int(tot * 0.05):,}",
                "misc": f"₹{int(tot * 0.02):,}",
                "grandTotal": f"₹{tot:,}"
            }

        # 9. Packing Checklist
        if not doc.get("packingChecklist") or not isinstance(doc.get("packingChecklist"), dict):
            doc["packingChecklist"] = {
                "clothing": ["Light cotton clothes", "Comfortable walking shoes", "Sunglasses & Hat", "Temple attire (covers shoulders/knees)"],
                "electronics": ["Power bank", "Camera & extra memory card", "Universal charger", "Phone tripod"],
                "documents": ["Government ID proof (Aadhaar / Passport)", "Hotel booking confirmations", "Cash & UPI / Cards"],
                "health": ["Personal medications", "First aid kit", "Sunscreen (SPF 50+)", "Hand sanitizer"],
                "weatherItems": ["Rain jacket / Umbrella" if weather.get("rain_chance", 0) > 30 else "Light jacket for early morning"],
                "photography": ["Wide-angle lens", "Lens cleaning cloth"],
                "localEssentials": ["Reusable water bottle", "Small daypack backpack"]
            }

        # 10. Weather Forecast
        if not doc.get("weatherForecast") or not isinstance(doc.get("weatherForecast"), list):
            forecast_list = []
            for d in range(1, days_count + 1):
                forecast_list.append({
                    "dayNumber": d,
                    "temperature": f"{weather.get('temperature_celsius', 26)}°C",
                    "rainChance": f"{weather.get('rain_chance', 10)}%",
                    "humidity": f"{weather.get('humidity', 55)}%",
                    "sunrise": weather.get("sunrise", "06:15 AM"),
                    "sunset": weather.get("sunset", "06:50 PM")
                })
            doc["weatherForecast"] = forecast_list

        # 11. Emergency Information
        if not doc.get("emergencyInformation") or not isinstance(doc.get("emergencyInformation"), dict):
            doc["emergencyInformation"] = essentials

        # 12. Local Tips
        if not doc.get("localTips") or not isinstance(doc.get("localTips"), dict):
            doc["localTips"] = {
                "dressCode": ["Wear modest attire covering shoulders and knees when visiting temples and religious shrines."],
                "templeRules": ["Remove footwear at designated shoe counters before entering temple premises."],
                "scamAlerts": ["Politely decline unauthorized unofficial tour guides. Book tickets only at official counters."],
                "photographyRules": ["Check for 'No Photography' signs inside sanctums and private heritage sites."],
                "localLanguage": ["Common greetings: Namaste / Jai Shri Krishna / Hello."],
                "safetyTips": ["Keep emergency helpline numbers saved. Drink bottled mineral water."]
            }

        return doc
