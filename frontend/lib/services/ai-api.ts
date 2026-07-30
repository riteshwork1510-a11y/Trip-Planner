import {
  ConversationalChatResponse,
  TripGenerationRequest,
  TripGenerationResponse,
  TripModificationResponse,
  TripPreviewResponse,
} from '@/types/ai';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AIApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || `API Request failed with status ${response.status}`);
    }

    return data as T;
  }

  /**
   * Generate personalized recommendations across all categories
   */
  async generateRecommendations(
    destination: string,
    travelStyle = 'Culture & Heritage',
    budgetTier = 'Moderate',
    travelersType = 'couple',
    interests?: string[]
  ): Promise<any> {
    return this.request('/api/v1/recommendations/generate', {
      method: 'POST',
      body: JSON.stringify({
        destination,
        travel_style: travelStyle,
        budget_tier: budgetTier,
        travelers_type: travelersType,
        interests,
      }),
    });
  }

  async getHotels(destination: string, travelStyle = 'Culture'): Promise<any> {
    return this.request(`/api/v1/recommendations/hotels?destination=${encodeURIComponent(destination)}&travel_style=${encodeURIComponent(travelStyle)}`, {
      method: 'GET',
    });
  }

  async getRestaurants(destination: string, travelStyle = 'Food'): Promise<any> {
    return this.request(`/api/v1/recommendations/restaurants?destination=${encodeURIComponent(destination)}&travel_style=${encodeURIComponent(travelStyle)}`, {
      method: 'GET',
    });
  }

  async getExperiences(destination: string, travelStyle = 'Culture'): Promise<any> {
    return this.request(`/api/v1/recommendations/experiences?destination=${encodeURIComponent(destination)}&travel_style=${encodeURIComponent(travelStyle)}`, {
      method: 'GET',
    });
  }

  async getShopping(destination: string, travelStyle = 'Shopping'): Promise<any> {
    return this.request(`/api/v1/recommendations/shopping?destination=${encodeURIComponent(destination)}&travel_style=${encodeURIComponent(travelStyle)}`, {
      method: 'GET',
    });
  }

  async getHiddenGems(destination: string, travelStyle = 'Nature'): Promise<any> {
    return this.request(`/api/v1/recommendations/hidden-gems?destination=${encodeURIComponent(destination)}&travel_style=${encodeURIComponent(travelStyle)}`, {
      method: 'GET',
    });
  }

  /**
   * Modify existing trip itinerary using natural language
   */
  async modifyTrip(tripId: string, modificationInstruction: string, versionNumber = 1): Promise<TripModificationResponse> {
    return this.request<TripModificationResponse>('/api/v1/ai/trip/modify', {
      method: 'POST',
      body: JSON.stringify({
        trip_id: tripId,
        modification_instruction: modificationInstruction,
        version_number: versionNumber,
      }),
    });
  }

  /**
   * Preview proposed modification without applying
   */
  async previewTrip(tripId: string, modificationInstruction: string): Promise<TripPreviewResponse> {
    return this.request<TripPreviewResponse>('/api/v1/ai/trip/preview', {
      method: 'POST',
      body: JSON.stringify({
        trip_id: tripId,
        modification_instruction: modificationInstruction,
      }),
    });
  }

  /**
   * Undo last modification
   */
  async undoTrip(tripId: string, currentVersionNumber: number): Promise<any> {
    return this.request('/api/v1/ai/trip/undo', {
      method: 'POST',
      body: JSON.stringify({
        trip_id: tripId,
        current_version_number: currentVersionNumber,
      }),
    });
  }

  /**
   * Redo modification
   */
  async redoTrip(tripId: string, currentVersionNumber: number): Promise<any> {
    return this.request('/api/v1/ai/trip/redo', {
      method: 'POST',
      body: JSON.stringify({
        trip_id: tripId,
        current_version_number: currentVersionNumber,
      }),
    });
  }

  /**
   * Fetch version history stack
   */
  async getTripVersionHistory(tripId: string): Promise<any> {
    return this.request(`/api/v1/ai/trip/history?trip_id=${tripId}`, {
      method: 'GET',
    });
  }

  /**
   * Send conversational chat turn
   */
  async sendChatMessage(message: string, conversationId?: string): Promise<ConversationalChatResponse> {
    return this.request<ConversationalChatResponse>('/api/v1/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
    });
  }

  /**
   * Submit initial trip generation request
   */
  async generateTrip(payload: TripGenerationRequest): Promise<TripGenerationResponse> {
    return this.request<TripGenerationResponse>('/api/v1/ai/generate-trip', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getTripById(tripId: string): Promise<any> {
    return this.request(`/api/v1/ai/trips/${tripId}`, { method: 'GET' });
  }

  async deleteTrip(tripId: string): Promise<any> {
    return this.request(`/api/v1/ai/trips/${tripId}`, { method: 'DELETE' });
  }
}

export const aiApiService = new AIApiService();
