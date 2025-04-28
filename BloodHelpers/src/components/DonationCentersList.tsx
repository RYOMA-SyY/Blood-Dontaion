import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Hospital, HospitalCard } from './HospitalCard';
import { findNearbyHospitals } from '@/utils/apiService';
import { DonationCenterDetails } from './DonationCenterDetails';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DonationCentersListProps {
  userLocation: {
    lat: number;
    lng: number;
    city: string;
  };
}

export const DonationCentersList: React.FC<DonationCentersListProps> = ({ userLocation }) => {
  const [selectedCenter, setSelectedCenter] = useState<Hospital | null>(null);
  const [centers, setCenters] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        setError(null);
        const hospitals = await findNearbyHospitals(userLocation);
        setCenters(hospitals);
        
        // Select the closest center by default
        if (hospitals.length > 0 && !selectedCenter) {
          setSelectedCenter(hospitals[0]);
        }
      } catch (err) {
        console.error('Error fetching centers:', err);
        setError('Failed to load donation centers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [userLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-blood animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Available Centers</h3>
        <div className="flex-1 lg:max-h-[calc(100vh-280px)]">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
              {centers.map((center) => (
                <HospitalCard
                  key={center.id}
                  hospital={center}
                  onSelect={() => setSelectedCenter(center)}
                  selected={selectedCenter?.id === center.id}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 mt-4">
          <p className="text-sm text-muted-foreground text-center">
            ⚠️ Demo Mode: Currently displaying mock data for demonstration purposes. 
            <br />
            Live hospital data integration pending API authorization and setup.
          </p>
        </div>
      </div>
      
      <div className="lg:sticky lg:top-6">
        {selectedCenter ? (
          <Card className="border-blood/10">
            <DonationCenterDetails
              hospital={selectedCenter}
            />
          </Card>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground border rounded-lg">
            Select a donation center to view details
          </div>
        )}
      </div>
    </div>
  );
}; 