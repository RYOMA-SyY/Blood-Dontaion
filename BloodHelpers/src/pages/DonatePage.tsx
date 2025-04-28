import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DonatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Become a Blood Donor</h1>
        <p className="text-lg mb-8">
          Your donation can save lives. Join our community of donors and make a difference today.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Why Donate?</h2>
            <ul className="space-y-3">
              <li>• Save up to 3 lives with one donation</li>
              <li>• Regular donations help maintain blood supply</li>
              <li>• Free health check-up with each donation</li>
              <li>• Join a community of life-savers</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
            <ul className="space-y-3">
              <li>• Age: 18-65 years</li>
              <li>• Weight: At least 50kg</li>
              <li>• Good health condition</li>
              <li>• No recent tattoos or piercings</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="bg-blood text-white hover:bg-blood/90"
            onClick={() => navigate('/find-center')}
          >
            Find a Donation Center
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonatePage; 