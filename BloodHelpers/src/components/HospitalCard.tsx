import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export interface Hospital {
  id: string;
  name: string;
  city: string;
  bloodTypesNeeded: string[];
  urgencyLevel: number; // 0-100 scale
  latitude: number;
  longitude: number;
  distance?: number;
}

interface HospitalCardProps {
  hospital: Hospital;
  onSelect: (hospital: Hospital) => void;
  selected?: boolean;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  onSelect,
  selected = false,
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-blood' : ''
      }`}
      onClick={() => onSelect(hospital)}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{hospital.name}</h3>
            {hospital.distance && (
              <span className="text-sm text-muted-foreground">
                {hospital.distance.toFixed(1)} km
              </span>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{hospital.city}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {hospital.bloodTypesNeeded.map((type) => (
              <span
                key={type}
                className={`px-2 py-1 rounded-full text-xs ${
                  hospital.urgencyLevel >= 70
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {type}
              </span>
            ))}
          </div>

          {hospital.urgencyLevel >= 70 && (
            <div className="mt-2">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(hospital);
                }}
              >
                Urgent Need
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;
