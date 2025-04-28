import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationPromptProps {
  onLocationSelected: (location: { lat: number; lng: number; city: string }) => void;
}

const moroccanCities = [
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Rabat", lat: 34.0209, lng: -6.8416 },
  { name: "Marrakesh", lat: 31.6295, lng: -7.9811 },
  { name: "Fes", lat: 34.0181, lng: -5.0078 },
  { name: "Tangier", lat: 35.7595, lng: -5.8340 },
  { name: "Agadir", lat: 30.4278, lng: -9.5981 },
  { name: "Meknes", lat: 33.8731, lng: -5.5357 },
  { name: "Oujda", lat: 34.6805, lng: -1.9112 },
  { name: "Kenitra", lat: 34.2610, lng: -6.5802 },
  { name: "Tetouan", lat: 35.5706, lng: -5.3769 }
];

const LocationPrompt: React.FC<LocationPromptProps> = ({ onLocationSelected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualSelection, setShowManualSelection] = useState(false);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setShowManualSelection(true);
      return;
    }
  }, []);

  const handleGeolocationRequest = () => {
    setLoading(true);
    setError(null);
    
    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const handleSuccess = (position: GeolocationPosition) => {
      setLoading(false);
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Check if the user is within Morocco's rough boundaries
      if (userLocation.lat < 21 || userLocation.lat > 36 ||
          userLocation.lng < -17 || userLocation.lng > -1) {
        setError("Location appears to be outside Morocco. Please select your city manually.");
        setShowManualSelection(true);
        return;
      }
      
      // Find the nearest city using Haversine formula
      let closestCity = moroccanCities[0];
      let minDistance = getHaversineDistance(
        userLocation.lat, userLocation.lng, 
        closestCity.lat, closestCity.lng
      );
      
      moroccanCities.forEach(city => {
        const distance = getHaversineDistance(
          userLocation.lat, userLocation.lng,
          city.lat, city.lng
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCity = city;
        }
      });

      // If closest city is more than 100km away, ask for manual selection
      if (minDistance > 100) {
        setError("Unable to determine your city accurately. Please select manually.");
        setShowManualSelection(true);
        return;
      }
      
      onLocationSelected({
        lat: closestCity.lat, // Use city coordinates for consistency
        lng: closestCity.lng,
        city: closestCity.name
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLoading(false);
      let errorMessage = "Unable to get your location. ";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "Please allow location access or select your city manually.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage += "Location request timed out.";
          break;
        default:
          errorMessage += "Please select your city manually.";
      }
      
      console.error("Geolocation error:", error);
      setError(errorMessage);
      setShowManualSelection(true);
    };
    
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geolocationOptions
    );
  };

  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const selectCity = (city: typeof moroccanCities[0]) => {
    onLocationSelected({
      lat: city.lat,
      lng: city.lng,
      city: city.name
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Warid</h2>
        <p className="text-muted-foreground mb-6">
          Every 2 minutes, a Moroccan needs blood. YOU can change that.
        </p>
        
        {!showManualSelection && (
          <Button 
            className="w-full bg-blood hover:bg-blood-dark text-white"
            onClick={handleGeolocationRequest}
            disabled={loading}
          >
            <MapPin className="mr-2 h-5 w-5" />
            {loading ? "Locating..." : "Share Your Location"}
          </Button>
        )}
        
        {error && (
          <p className="mt-2 text-red-400 text-sm">
            {error}
          </p>
        )}
        
        {!loading && (
          <p className="mt-3 text-sm text-muted-foreground">
            {!showManualSelection ? (
              <span 
                className="underline cursor-pointer" 
                onClick={() => setShowManualSelection(true)}
              >
                Or select your city manually
              </span>
            ) : "Please select your city:"}
          </p>
        )}
        
        {showManualSelection && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {moroccanCities.map((city) => (
              <Button
                key={city.name}
                variant="outline"
                className="text-sm"
                onClick={() => selectCity(city)}
              >
                {city.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        BOTTOM FRAGS | OpportunAI Hackathon
      </p>
    </div>
  );
};

export default LocationPrompt;
