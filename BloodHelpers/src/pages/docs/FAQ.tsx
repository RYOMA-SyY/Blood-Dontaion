import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Who can donate blood?",
      answer: "Generally, you can donate blood if you are in good health, weigh at least 50kg, and are between 18-65 years old. However, there are some medical conditions and medications that might prevent you from donating. Use our eligibility checker to determine if you can donate."
    },
    {
      question: "How often can I donate blood?",
      answer: "You can donate whole blood every 56 days (about 8 weeks). For other types of donations like platelets or plasma, the waiting period may be shorter. Our system will track your donation history and notify you when you're eligible to donate again."
    },
    {
      question: "What should I do before donating?",
      answer: "Before donating, make sure to:\n• Get a good night's sleep\n• Eat a healthy meal\n• Drink plenty of fluids\n• Bring a valid ID\n• Wear comfortable clothing with sleeves that can be rolled up"
    },
    {
      question: "How long does the donation process take?",
      answer: "The entire process typically takes about 45-60 minutes:\n• Registration and health screening: 10-15 minutes\n• Donation: 10-15 minutes\n• Rest and refreshments: 10-15 minutes"
    },
    {
      question: "Is donating blood safe?",
      answer: "Yes, donating blood is very safe. All equipment used is sterile, single-use, and disposed of after each donation. The staff are trained professionals who follow strict safety protocols."
    },
    {
      question: "What happens to my blood after donation?",
      answer: "After donation, your blood goes through several steps:\n1. Testing for infectious diseases\n2. Separation into components (red cells, plasma, platelets)\n3. Storage in appropriate conditions\n4. Distribution to hospitals as needed"
    },
    {
      question: "Can I donate if I have a tattoo or piercing?",
      answer: "You may need to wait 3-6 months after getting a tattoo or piercing before donating blood. This waiting period helps ensure your safety and the safety of the blood supply."
    },
    {
      question: "What are the benefits of donating blood?",
      answer: "Donating blood has several benefits:\n• Helps save lives\n• Provides a free health check-up\n• Reduces the risk of heart disease\n• Burns calories\n• Gives you a sense of fulfillment"
    }
  ];

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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>
              <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ; 