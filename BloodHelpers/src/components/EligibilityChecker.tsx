import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OPENROUTER_API_KEY = "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";
const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

interface FormData {
  age: string;
  weight: string;
  lastDonation: string;
  medications: string;
  medicalConditions: string;
  gender: 'male' | 'female';
}

interface EligibilityResult {
  isEligible: boolean;
  reason: string;
  recommendations: string[];
  waitTime: string;
  nextSteps: string;
}

export const EligibilityChecker: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    lastDonation: '',
    medications: '',
    medicalConditions: '',
    gender: 'male'
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const prompt = `You are Warid, a blood donation eligibility checker in Morocco. Based on the following information, determine if the person is eligible to donate blood. Consider Moroccan health guidelines and international blood donation standards.

Person Details:
- Age: ${formData.age} years
- Weight: ${formData.weight} kg
- Gender: ${formData.gender}
- Last Donation: ${formData.lastDonation}
- Medical Conditions: ${formData.medicalConditions || 'None reported'}
- Current Medications: ${formData.medications || 'None reported'}

Provide a detailed but concise assessment in this JSON format:
{
  "isEligible": true/false,
  "reason": "Clear explanation of the decision",
  "recommendations": ["Specific, actionable recommendations"],
  "waitTime": "Time to wait before donation if ineligible, or 'None' if eligible",
  "nextSteps": "Immediate next steps the person should take"
}

Be specific about any waiting periods and include relevant health and safety recommendations.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'Warid'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Eligibility check API Error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        console.warn('Unexpected API response format:', data);
        throw new Error('Invalid response format from API');
      }

      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('Could not extract JSON from AI response:', aiResponse);
        throw new Error('Could not extract JSON from AI response');
      }

      try {
        const result = JSON.parse(jsonMatch[0]);
        setResult(result);
        setShowDialog(true);
      } catch (parseError) {
        console.error('Error parsing eligibility result:', parseError);
        throw new Error('Invalid JSON format in AI response');
      }
    } catch (error) {
      console.error('Eligibility check error:', error);
      setResult({
        isEligible: false,
        reason: 'We encountered a technical issue while checking your eligibility. Please try again in a few moments or visit a Warid donation center for a personal assessment.',
        recommendations: [
          'Visit your nearest donation center for an in-person assessment',
          'Bring a valid ID and any relevant medical documentation',
          'Contact our support team if the issue persists'
        ],
        waitTime: 'Unknown',
        nextSteps: 'Please visit a donation center for accurate eligibility assessment'
      });
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-background border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-blood">Warid Eligibility Check</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Years"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Kilograms"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value: 'male' | 'female') => 
                setFormData(prev => ({ ...prev, gender: value }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastDonation">Last Blood Donation</Label>
            <Input
              id="lastDonation"
              placeholder="e.g., 3 months ago, never"
              value={formData.lastDonation}
              onChange={(e) => setFormData(prev => ({ ...prev, lastDonation: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Input
              id="medications"
              placeholder="List any medications you're taking"
              value={formData.medications}
              onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Input
              id="medicalConditions"
              placeholder="List any medical conditions"
              value={formData.medicalConditions}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blood hover:bg-blood-dark text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Eligibility...
              </>
            ) : (
              'Check Eligibility'
            )}
          </Button>
        </form>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="eligibility-result-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {result?.isEligible ? (
                <span className="text-green-600">✅ Eligible to Donate</span>
              ) : (
                <span className="text-red-600">❌ Currently Not Eligible</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" id="eligibility-result-description">
            <p className="text-lg">{result?.reason}</p>
            
            {result?.recommendations?.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-800 mb-2">Recommendations:</h3>
                <ul className="list-disc pl-4 text-blue-800">
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result?.waitTime && result.waitTime !== 'None' && (
              <div className="bg-yellow-50 p-4 rounded-md">
                <h3 className="font-semibold text-yellow-800">Waiting Period:</h3>
                <p className="text-yellow-800">{result.waitTime}</p>
              </div>
            )}

            {result?.nextSteps && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Next Steps:</h3>
                <p className="text-muted-foreground">{result.nextSteps}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Close
            </Button>
            {result?.isEligible && (
              <Button
                className="bg-blood hover:bg-blood-dark text-white"
                onClick={() => {
                  setShowDialog(false);
                  // You can add navigation to donation centers or appointment booking here
                }}
              >
                Find Donation Center
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EligibilityChecker; 