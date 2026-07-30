import { PlannerFormData, GeneratedItinerary, DayItinerary, ActivityItem } from "@/types/planner";

/**
 * Generates an AI-powered travel itinerary using Google Gemini REST API
 */
export async function generateItineraryWithGemini(
  formData: PlannerFormData
): Promise<GeneratedItinerary> {
  const apiKey = formData.userApiKey?.trim() || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `You are a world-class travel architect and local expert guide. Generate a comprehensive, highly detailed, realistic day-by-day travel itinerary for a trip to "${formData.destination}".
Trip Details:
- Duration: ${formData.durationDays} days
- Travelers: ${formData.travelers}
- Budget Tier: ${formData.budgetLevel}
- Pace: ${formData.pace}
- Interests: ${formData.interests.join(", ")}
${formData.specialPreferences ? `- Special Notes/Constraints: ${formData.specialPreferences}` : ""}

CRITICAL REQUIREMENTS:
Respond ONLY with a valid, parseable raw JSON object (without markdown code blocks, backticks, or extra text) following this exact schema:

{
  "title": "A captivating title for the trip",
  "summary": "2-3 sentence overview of what makes this trip special",
  "bestTimeToVisit": "Optimal months to visit",
  "vibe": "1-3 words capturing the vibe",
  "budgetBreakdown": {
    "accommodation": "$XXX - description",
    "foodAndDining": "$XXX - description",
    "activitiesAndAttractions": "$XXX - description",
    "localTransport": "$XXX - description",
    "totalEstimatedCost": "$XXX total estimated",
    "currency": "USD or local currency symbol"
  },
  "packingList": ["Essential item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
  "localTips": ["Insider tip 1", "Insider tip 2", "Insider tip 3"],
  "days": [
    {
      "dayNumber": 1,
      "dateTitle": "Day 1: Arrival & First Impressions",
      "theme": "Exploration & Welcome Dinner",
      "activities": [
        {
          "id": "act-1-1",
          "timeSlot": "Morning",
          "title": "Activity Title",
          "description": "Engaging 2-sentence description",
          "location": "Exact spot or neighborhood",
          "estimatedCost": "$XX",
          "category": "Sightseeing",
          "tips": "Practical tip for this spot"
        },
        {
          "id": "act-1-2",
          "timeSlot": "Afternoon",
          "title": "Lunch & Afternoon Landmark",
          "description": "Details",
          "location": "Location Name",
          "estimatedCost": "$XX",
          "category": "Food",
          "tips": "Tip"
        },
        {
          "id": "act-1-3",
          "timeSlot": "Evening",
          "title": "Evening Walk & Dinner",
          "description": "Details",
          "location": "Location Name",
          "estimatedCost": "$XX",
          "category": "Culture",
          "tips": "Tip"
        }
      ]
    }
  ]
}

Generate exactly ${formData.durationDays} days. Ensure activities match the specified pace and interests.`;

      // Models to try in order of preference
      const models = ["gemini-[#model]", "gemini-1.5-flash", "gemini-pro"];
      let responseData: any = null;

      for (const model of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 8192,
                },
              }),
            }
          );

          if (res.ok) {
            responseData = await res.json();
            break;
          }
        } catch (e) {
          console.warn(`Model ${model} failed, trying fallback...`, e);
        }
      }

      if (responseData) {
        const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        // Clean markdown backticks if present
        const cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText);

        return {
          id: `trip-${Date.now()}`,
          destination: formData.destination,
          daysCount: formData.durationDays,
          travelers: formData.travelers,
          budgetLevel: formData.budgetLevel,
          pace: formData.pace,
          interests: formData.interests,
          title: parsed.title || `${formData.durationDays}-Day ${formData.destination} Getaway`,
          summary: parsed.summary || `A tailored itinerary designed for your trip to ${formData.destination}.`,
          bestTimeToVisit: parsed.bestTimeToVisit || "October to March",
          vibe: parsed.vibe || "Scenic & Memorable",
          budgetBreakdown: parsed.budgetBreakdown || {
            accommodation: "$500 - Mid-range Hotels",
            foodAndDining: "$300 - Local Cafes & Restaurants",
            activitiesAndAttractions: "$200 - Entry Tickets & Guided Tours",
            localTransport: "$100 - Taxis & Public Transit",
            totalEstimatedCost: "$1,100 Estimated Total",
            currency: "USD",
          },
          packingList: parsed.packingList || ["Comfortable Walking Shoes", "Universal Power Adapter", "Sunscreen & Sunglasses", "Travel Documents"],
          localTips: parsed.localTips || ["Book tickets in advance for popular attractions", "Use local ride-hailing apps for cheap transport", "Try street food at busy vendors for fresh meals"],
          days: parsed.days || [],
          createdAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("Gemini API call error, using smart fallback generator:", err);
    }
  }

  // Fallback / Offline Generator if API key fails or isn't provided
  return generateFallbackItinerary(formData);
}

/**
 * High quality offline itinerary generator
 */
function generateFallbackItinerary(formData: PlannerFormData): GeneratedItinerary {
  const dest = formData.destination;
  const days = formData.durationDays;
  const interestsStr = formData.interests.join(", ") || "General Sightseeing";

  const daysList: DayItinerary[] = [];

  const activityPool = [
    { title: "Arrival & Hotel Check-in", slot: "Morning" as const, cat: "Relaxation" as const, cost: "$20", desc: `Arrive in ${dest}, check into your accommodation, and refresh.` },
    { title: "Historic City Center & Orientation Walk", slot: "Afternoon" as const, cat: "Sightseeing" as const, cost: "$15", desc: `Stroll through the iconic streets of ${dest} and discover key landmarks.` },
    { title: "Welcome Dinner & Local Cuisine", slot: "Evening" as const, cat: "Food" as const, cost: "$35", desc: `Savor authentic local dishes at a top-rated traditional restaurant in ${dest}.` },
    
    { title: "Top Cultural Heritage Museum", slot: "Morning" as const, cat: "Culture" as const, cost: "$25", desc: `Explore fascinating artifacts and history at ${dest}'s premier heritage museum.` },
    { title: "Panoramic Viewpoint & Photo Spot", slot: "Afternoon" as const, cat: "Sightseeing" as const, cost: "$10", desc: `Capture breathtaking 360-degree views of ${dest} from the highest viewpoint.` },
    { title: "Sunset Promenade & Night Market", slot: "Evening" as const, cat: "Shopping" as const, cost: "$30", desc: `Experience the buzzing night markets, artisan crafts, and street performances.` },

    { title: "Outdoor Nature Exploration & Parks", slot: "Morning" as const, cat: "Adventure" as const, cost: "$15", desc: `Immerse in nature with a guided walk through lush botanical gardens and parks.` },
    { title: "Culinary Tasting & Food Tour", slot: "Afternoon" as const, cat: "Food" as const, cost: "$40", desc: `Sample delicious regional snacks and sweets with a local food expert.` },
    { title: "Stargazing or Rooftop Lounge", slot: "Night" as const, cat: "Relaxation" as const, cost: "$25", desc: `Unwind with signature drinks and ambient music overlooking ${dest}'s night skyline.` },
  ];

  for (let i = 1; i <= days; i++) {
    const act1 = activityPool[(i * 3 - 3) % activityPool.length];
    const act2 = activityPool[(i * 3 - 2) % activityPool.length];
    const act3 = activityPool[(i * 3 - 1) % activityPool.length];

    daysList.push({
      dayNumber: i,
      dateTitle: `Day ${i}: ${i === 1 ? "Arrival & Discovery" : i === days ? "Farewell & Highlights" : `Exploring ${dest}`}`,
      theme: i === 1 ? "Arrival & Orientation" : `Focus on ${formData.interests[(i - 1) % formData.interests.length] || "Highlights"}`,
      activities: [
        {
          id: `act-${i}-1`,
          timeSlot: act1.slot,
          title: `${act1.title} in ${dest}`,
          description: act1.desc,
          location: `${dest} Central Area`,
          estimatedCost: act1.cost,
          category: act1.cat,
          tips: "Wear comfortable walking shoes and keep your camera ready.",
        },
        {
          id: `act-${i}-2`,
          timeSlot: act2.slot,
          title: `${act2.title}`,
          description: act2.desc,
          location: `${dest} Main District`,
          estimatedCost: act2.cost,
          category: act2.cat,
          tips: "Pre-booking tickets online saves 20 minutes at the entrance.",
        },
        {
          id: `act-${i}-3`,
          timeSlot: act3.slot,
          title: `${act3.title}`,
          description: act3.desc,
          location: `${dest} Night Quarter`,
          estimatedCost: act3.cost,
          category: act3.cat,
          tips: "Great spot for evening photography and relaxing.",
        },
      ],
    });
  }

  const isLuxury = formData.budgetLevel === "luxury";
  const isBudget = formData.budgetLevel === "budget";

  return {
    id: `trip-${Date.now()}`,
    destination: dest,
    daysCount: days,
    travelers: formData.travelers,
    budgetLevel: formData.budgetLevel,
    pace: formData.pace,
    interests: formData.interests,
    title: `${days}-Day Ultimate ${dest} Travel Experience`,
    summary: `A customized ${days}-day itinerary for ${formData.travelers} focused on ${interestsStr}. Designed with a ${formData.pace} pace and ${formData.budgetLevel} budget.`,
    bestTimeToVisit: "October to March & April to June",
    vibe: isLuxury ? "Luxury & Exclusive" : isBudget ? "Budget-Friendly & Scenic" : "Balanced & Authentic",
    budgetBreakdown: {
      accommodation: isLuxury ? "$1,200 - 5-Star Resorts" : isBudget ? "$250 - Hostels / Boutique Stays" : "$600 - 4-Star Hotels",
      foodAndDining: isLuxury ? "$600 - Fine Dining & Rooftops" : isBudget ? "$180 - Local Cafes & Markets" : "$350 - Mixed Dining",
      activitiesAndAttractions: isLuxury ? "$400 - Private Tours & VIP Pass" : isBudget ? "$120 - Public Landmarks" : "$250 - Entry Tickets",
      localTransport: isLuxury ? "$300 - Private Chauffeur" : isBudget ? "$50 - Metro & Buses" : "$140 - Taxis & Rideshare",
      totalEstimatedCost: isLuxury ? "$2,500 Total" : isBudget ? "$600 Total" : "$1,340 Total",
      currency: "USD",
    },
    packingList: [
      "Comfortable Walking Shoes & Sandals",
      "Universal Travel Power Adapter & Power Bank",
      "Weather-Appropriate Clothing & Light Jacket",
      "Sunscreen, Sunglasses & Refillable Water Bottle",
      "Government Issued ID & Digital Ticket Copies",
    ],
    localTips: [
      `Download offline maps of ${dest} before departing.`,
      "Keep a small amount of local cash for street vendors and tips.",
      "Check local temple/monument dress codes prior to visiting.",
    ],
    days: daysList,
    createdAt: new Date().toISOString(),
  };
}
