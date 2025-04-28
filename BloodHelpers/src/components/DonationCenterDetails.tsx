import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Hospital } from './HospitalCard';
import { getHospitalDetails } from '@/utils/placesService';
import { Phone, Globe, Clock, MapPin, Loader2 } from 'lucide-react';
import BloodUrgencyMeter from './BloodUrgencyMeter';

interface DonationCenterDetailsProps {
  hospital: Hospital;
}

interface ExtendedHospitalDetails {
  formatted_address: string;
  phone?: string;
  website?: string;
  opening_hours?: string;
}

export const DonationCenterDetails: React.FC<DonationCenterDetailsProps> = ({ hospital }) => {
  const [details, setDetails] = useState<ExtendedHospitalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const hospitalDetails = await getHospitalDetails(hospital.name, hospital.city);
        setDetails(hospitalDetails);
      } catch (err) {
        setError('Could not fetch hospital details. Please try again later.');
        console.error('Error fetching hospital details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [hospital.name, hospital.city]);

  if (loading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blood" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">{hospital.name}</h2>
        
        <div className="space-y-6">
          {/* Blood Urgency Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Blood Urgency Level</h3>
            <BloodUrgencyMeter urgencyLevel={hospital.urgencyLevel} />
          </div>

          {/* Blood Types Needed Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Blood Types Needed</h3>
            <div className="flex flex-wrap gap-2">
              {hospital.bloodTypesNeeded.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-red-100 text-blood rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Location and Contact Details */}
          <div className="space-y-3">
            {details?.formatted_address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                <span>{details.formatted_address}</span>
              </div>
            )}
            
            {details?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a href={`tel:${details.phone}`} className="hover:underline">
                  {details.phone}
                </a>
              </div>
            )}
            
            {details?.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a 
                  href={details.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
            
            {details?.opening_hours && (
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 mt-1 text-muted-foreground" />
                <span className="whitespace-pre-line">{details.opening_hours}</span>
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="mt-4">
            <iframe
              title="Hospital Location"
              width="100%"
              height="300"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${hospital.longitude-0.01}%2C${hospital.latitude-0.01}%2C${hospital.longitude+0.01}%2C${hospital.latitude+0.01}&layer=mapnik&marker=${hospital.latitude}%2C${hospital.longitude}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 