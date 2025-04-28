import axios from 'axios';

interface PlaceDetails {
  name: string;
  formatted_address: string;
  phone?: string;
  website?: string;
  opening_hours?: string;
  latitude: number;
  longitude: number;
}

export async function getHospitalDetails(name: string, city: string): Promise<PlaceDetails> {
  try {
    // Use Nominatim to search for the hospital
    const searchResponse = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: `${name} hospital ${city} Morocco`,
          format: 'json',
          addressdetails: 1,
          limit: 1,
          countrycodes: 'ma'
        },
        headers: {
          'User-Agent': 'Warid/1.0'
        }
      }
    );

    if (!searchResponse.data?.[0]) {
      // If no exact match found, return basic info
      return {
        name: name,
        formatted_address: `${city}, Morocco`,
        latitude: 0,
        longitude: 0,
        opening_hours: "Contact hospital for hours",
        phone: "Not available",
        website: undefined
      };
    }

    const result = searchResponse.data[0];
    
    // Get additional details using the OSM ID
    const detailsResponse = await axios.get(
      `https://nominatim.openstreetmap.org/details`,
      {
        params: {
          place_id: result.place_id,
          format: 'json'
        },
        headers: {
          'User-Agent': 'Warid/1.0'
        }
      }
    );

    // Format the address components
    const address = result.address;
    const formatted_address = [
      address.road,
      address.suburb,
      address.city || address.town || city,
      address.state,
      'Morocco'
    ].filter(Boolean).join(', ');

    // Extract contact details if available
    const tags = (detailsResponse.data as { extratags?: Record<string, string> })?.extratags || {};

    return {
      name: name,
      formatted_address,
      phone: tags['phone'] || tags['contact:phone'] || 'Contact hospital for phone number',
      website: tags['website'] || tags['contact:website'],
      opening_hours: tags['opening_hours'] || '24/7 for emergencies',
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    // Return basic info on error
    return {
      name: name,
      formatted_address: `${city}, Morocco`,
      latitude: 0,
      longitude: 0,
      opening_hours: "Contact hospital for hours",
      phone: "Not available",
      website: undefined
    };
  }
} 