import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const APIDocs = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/docs')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Documentation
      </Button>

      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1>API Documentation</h1>
        
        <section className="mb-8">
          <h2>Authentication</h2>
          <p>
            All API requests require authentication using a JWT token. Include the token in the Authorization header:
          </p>
          <pre className="bg-gray-100 p-4 rounded-lg">
            {`Authorization: Bearer <your_jwt_token>`}
          </pre>
        </section>

        <section className="mb-8">
          <h2>Endpoints</h2>
          
          <div className="mb-6">
            <h3>Get Donation Centers</h3>
            <pre className="bg-gray-100 p-4 rounded-lg">
              {`GET /api/centers
Query Parameters:
- lat: number (required)
- lng: number (required)
- radius: number (optional, default: 10km)

Response:
{
  centers: [
    {
      id: string,
      name: string,
      address: string,
      phone: string,
      distance: number,
      openingHours: string[]
    }
  ]
}`}
            </pre>
          </div>

          <div className="mb-6">
            <h3>Check Eligibility</h3>
            <pre className="bg-gray-100 p-4 rounded-lg">
              {`POST /api/eligibility
Request Body:
{
  age: number,
  weight: number,
  healthConditions: string[],
  recentTravel: boolean,
  medications: string[]
}

Response:
{
  eligible: boolean,
  reasons: string[],
  nextEligibleDate?: string
}`}
            </pre>
          </div>

          <div className="mb-6">
            <h3>Create Appointment</h3>
            <pre className="bg-gray-100 p-4 rounded-lg">
              {`POST /api/appointments
Request Body:
{
  centerId: string,
  date: string,
  time: string,
  userId: string
}

Response:
{
  appointmentId: string,
  status: string,
  confirmationCode: string
}`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2>Error Handling</h2>
          <p>
            All errors return a standard error response:
          </p>
          <pre className="bg-gray-100 p-4 rounded-lg">
            {`{
  error: {
    code: string,
    message: string,
    details?: any
  }
}`}
          </pre>
        </section>

        <section className="mb-8">
          <h2>Rate Limiting</h2>
          <p>
            API requests are limited to:
          </p>
          <ul>
            <li>100 requests per minute for authenticated users</li>
            <li>20 requests per minute for unauthenticated users</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default APIDocs; 