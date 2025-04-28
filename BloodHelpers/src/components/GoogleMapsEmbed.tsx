import React, { useState } from 'react';

interface GoogleMapsEmbedProps {
  location: string;
  className?: string;
  zoom?: number;
  showDirections?: boolean;
}

export const GoogleMapsEmbed: React.FC<GoogleMapsEmbedProps> = ({ 
  location, 
  className = '',
  zoom = 15,
  showDirections = true
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Using OpenStreetMap embed URL
  const encodedLocation = encodeURIComponent(location);
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-8.0859375%2C31.203404950917395%2C-7.9638671875%2C31.273544142150495&layer=mapnik&marker=31.238419984909525%2C-8.024902343750002`;

  return (
    <div className={`relative w-full rounded-lg overflow-hidden ${className}`}>
      {error && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-red-50 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
      
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        onLoad={() => {
          console.log('Map loaded for:', location);
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error('Map loading error for:', location);
          setError('Failed to load map');
          setIsLoading(false);
        }}
      />

      {showDirections && (
        <a
          href={`https://www.openstreetmap.org/directions?from=&to=${encodedLocation}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM3.5 10a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 2.5a.5.5 0 01.5.5v4.5h4.5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5z" clipRule="evenodd" />
          </svg>
          Get Directions
        </a>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood"></div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsEmbed; 