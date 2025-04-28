import { Hospital } from "../components/HospitalCard";

const OPENROUTER_API_KEY = "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";
const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function findNearbyHospitals(
  location: { lat: number; lng: number; city: string }
): Promise<Hospital[]> {
  try {
    console.log(`Finding hospitals near ${location.city} (${location.lat}, ${location.lng})`);
    
    // Get mock data first
    const { getMockHospitalsForCity } = await import("./mockData");
    const hospitals = getMockHospitalsForCity(location.city);
    
    // Calculate real distances using Haversine formula
    const hospitalsWithDistance = hospitals.map(hospital => ({
      ...hospital,
      distance: calculateHaversineDistance(
        location.lat, location.lng,
        hospital.latitude, hospital.longitude
      )
    }));

    // Sort by distance first
    const sortedHospitals = hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Then enhance with AI data
    return enhanceWithAIData(sortedHospitals, location);
  } catch (error) {
    console.error("Error finding nearby hospitals:", error);
    return [];
  }
}

// Haversine formula for accurate Earth distance calculations
function calculateHaversineDistance(
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI/180);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

async function enhanceWithAIData(
  hospitals: Hospital[],
  location: { lat: number; lng: number; city: string }
): Promise<Hospital[]> {
  try {
    const hospitalNames = hospitals.map(h => h.name).join(", ");
    
    const prompt = `You are Warid AI, an assistant for blood donation services in Morocco.
    
For the following hospitals in ${location.city}, Morocco, analyze and provide:
1. Current blood type needs (A+, A-, B+, B-, AB+, AB-, O+, O-)
2. Urgency level (0-100) based on hospital capacity and current demands
3. Identify hospitals with critical needs requiring immediate donors

Consider their distances from the user's location (${location.lat}, ${location.lng}) when determining urgency.

Be realistic and data-driven. Format as JSON:
{
  "hospitals": [
    {
      "name": "Hospital Name",
      "bloodTypesNeeded": ["A+", "O-"],
      "urgencyLevel": 85,
      "hasUrgentNeed": true,
      "currentStatus": "Brief status description"
    }
  ]
}

Hospitals to analyze: ${hospitalNames}`;

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.href,
        "X-Title": "Warid",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "temperature": 0.7,
        "max_tokens": 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Warid API Error Details:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponseText = data.choices?.[0]?.message?.content || '';
    
    let jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not extract JSON from Warid AI response:", aiResponseText);
      throw new Error("Invalid response format");
    }
    
    try {
      const aiData = JSON.parse(jsonMatch[0]);
      
      return hospitals.map(hospital => {
        const aiHospital = aiData.hospitals?.find((h: any) => h.name === hospital.name);
        if (aiHospital) {
          return {
            ...hospital,
            bloodTypesNeeded: aiHospital.bloodTypesNeeded || ["O+", "O-"],
            bloodUrgencyLevel: aiHospital.urgencyLevel || 50,
            hasUrgentNeed: aiHospital.hasUrgentNeed || false,
            currentStatus: aiHospital.currentStatus || "Status information unavailable"
          };
        }
        return {
          ...hospital,
          bloodTypesNeeded: generateRandomBloodTypes(),
          bloodUrgencyLevel: Math.floor(Math.random() * 100),
          hasUrgentNeed: Math.random() > 0.7,
          currentStatus: "Real-time status temporarily unavailable"
        };
      });
    } catch (parseError) {
      console.error("Error parsing Warid AI response:", parseError);
      throw new Error("Invalid data format in response");
    }
  } catch (error) {
    console.error("Error fetching Warid AI data:", error);
    return hospitals;
  }
}

function generateRandomBloodTypes() {
  const allTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const count = Math.floor(Math.random() * 4) + 1;
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allTypes.length);
    result.push(allTypes[randomIndex]);
    allTypes.splice(randomIndex, 1);
  }
  
  return result;
}

// For testing the API
export async function testAIAPI() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.href,
        "X-Title": "Warid",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
          {
            "role": "user",
            "content": "Respond with 'Warid AI connection successful' if you can read this"
          }
        ],
        "temperature": 0.7,
        "max_tokens": 100
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Warid API Test Error Details:", errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.warn("Unexpected Warid API response format:", data);
      return "API response format error";
    }
    return content;
  } catch (error) {
    console.error("Warid API test failed:", error);
    return 'API connection failed';
  }
}
