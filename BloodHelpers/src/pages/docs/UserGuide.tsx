import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const UserGuide = () => {
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
        <h1>User Guide</h1>
        
        <section className="mb-8">
          <h2>Getting Started</h2>
          <p>
            Welcome to BloodHelpers! This guide will help you navigate through the application
            and make the most of its features.
          </p>
        </section>

        <section className="mb-8">
          <h2>Finding Donation Centers</h2>
          <ol>
            <li>Click on "Find Donation Centers" in the navigation menu</li>
            <li>Allow location access when prompted</li>
            <li>View the list of nearby donation centers</li>
            <li>Click on a center to see more details</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2>Checking Eligibility</h2>
          <p>
            Use our eligibility checker to determine if you can donate blood:
          </p>
          <ul>
            <li>Navigate to the Eligibility Checker</li>
            <li>Answer the health-related questions</li>
            <li>Get immediate feedback on your eligibility status</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Creating an Account</h2>
          <p>
            To access all features, create an account:
          </p>
          <ol>
            <li>Click "Sign Up" in the top right corner</li>
            <li>Fill in your details</li>
            <li>Verify your email address</li>
            <li>Complete your profile</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2>Managing Your Profile</h2>
          <p>
            Your profile allows you to:
          </p>
          <ul>
            <li>Track your donation history</li>
            <li>Update your personal information</li>
            <li>Set donation reminders</li>
            <li>View your achievements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Using the Chatbot</h2>
          <p>
            Our AI-powered chatbot can help you with:
          </p>
          <ul>
            <li>Answering questions about blood donation</li>
            <li>Providing information about eligibility</li>
            <li>Helping you find donation centers</li>
            <li>Setting up donation appointments</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UserGuide; 