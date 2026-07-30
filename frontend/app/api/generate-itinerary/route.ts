import { NextRequest, NextResponse } from "next/server";
import { generateItineraryWithGemini } from "@/lib/planner-ai";
import { PlannerFormData } from "@/types/planner";

export async function POST(req: NextRequest) {
  try {
    const body: PlannerFormData = await req.json();

    if (!body.destination || !body.durationDays) {
      return NextResponse.json(
        { error: "Destination and duration in days are required." },
        { status: 400 }
      );
    }

    const itinerary = await generateItineraryWithGemini(body);

    return NextResponse.json(itinerary, { status: 200 });
  } catch (error: any) {
    console.error("API /api/generate-itinerary error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate itinerary." },
      { status: 500 }
    );
  }
}
