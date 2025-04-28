import React from 'react';
import { Progress } from '@/components/ui/progress';

interface BloodUrgencyMeterProps {
  urgencyLevel: number;
}

const BloodUrgencyMeter: React.FC<BloodUrgencyMeterProps> = ({ urgencyLevel }) => {
  // Normalize urgency level to 0-100 scale
  const normalizedLevel = Math.min(Math.max(urgencyLevel * 20, 0), 100);

  // Determine color based on urgency level
  const getColor = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Urgency Level</span>
        <span className={`font-medium ${getColor(normalizedLevel).replace('bg-', 'text-')}`}>
          {Math.round(normalizedLevel)}%
        </span>
      </div>
      <Progress 
        value={normalizedLevel} 
        className={`h-2 ${getColor(normalizedLevel)}`}
      />
    </div>
  );
};

export default BloodUrgencyMeter;
