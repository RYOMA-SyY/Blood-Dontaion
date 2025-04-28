import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ReactMarkdown from 'react-markdown';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  location?: string;
}

const OPENROUTER_API_KEY = "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";
const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const DONOR_RANKS = `
# 🩸 Donor Rank System

Here are our prestigious donor ranks:

1. **Iron Donor** (0-49 LifePoints)
   - Entry level rank
   - Just getting started
   - Every drop makes a difference

2. **Bronze Donor** (50-99 LifePoints)
   - New but committed donor
   - Shows dedication to the cause
   - Building a foundation of giving

3. **Silver Donor** (100-199 LifePoints)
   - Emerging lifesaver
   - Consistent contribution
   - Making a real impact

4. **Gold Donor** (200-349 LifePoints)
   - Reliable and steady donor
   - Significant contribution to saving lives
   - Respected member of the donation community

5. **Platinum Donor** (350-499 LifePoints)
   - Trusted hero
   - Outstanding commitment
   - Inspiring others to donate

6. **Diamond Donor** (500-749 LifePoints)
   - Rare and consistent contributor
   - Deeply valued member
   - Setting an example for others

7. **Crimson Donor** 🔴 (750-999 LifePoints)
   - Elite rank
   - Symbol of passion and power
   - True life warrior
   - Distinguished service to the community

8. **Immortal Donor** ⚡ (1000+ LifePoints)
   - Legendary status
   - Eternal impact on countless lives
   - Maximum level of achievement
   - Legacy of saving lives

### How to Earn LifePoints:
- 🩸 Regular blood donations
- 👥 Recruiting new donors
- 🎯 Participating in blood drive events
- 📢 Sharing donation experiences
- 💪 Supporting the donation community
`;

const detectLanguage = (text: string): 'ar' | 'fr' | 'en' => {
  // Arabic character range
  const arabicRegex = /[\u0600-\u06FF]/;
  // French specific characters
  const frenchRegex = /[àâäéèêëîïôöùûüÿçœæ]/i;
  
  if (arabicRegex.test(text)) return 'ar';
  if (frenchRegex.test(text)) return 'fr';
  return 'en';
};

const SYSTEM_PROMPT = `You are Warid AI, a helpful assistant for blood donation in Morocco. 
Your name "Warid" means "artery" in Arabic, symbolizing the vital flow of life through blood donation.

IMPORTANT: You MUST detect and respond in the same language the user writes in:
- If they write in Arabic (العربية), respond in Arabic
- If they write in French, respond in French
- If they write in English or any other language, respond in English

You provide accurate, concise information about:
- Blood donation eligibility
- The donation process
- Benefits and importance of donation
- Common concerns and misconceptions
- Post-donation care
- Blood type compatibility
- Local donation centers

You also manage our gamified donor ranking system:
${DONOR_RANKS}

When discussing ranks:
- Encourage users to progress through the ranks
- Explain how to earn LifePoints
- Highlight the prestige of higher ranks
- Emphasize the real-world impact of consistent donation
- Make it engaging and motivating

Important formatting rules:
1. Use Markdown formatting in your responses
2. Use bold (**text**) for emphasis
3. Use headings (# or ##) for main points
4. Use emojis to make responses engaging
5. Use lists (- or 1.) for multiple points
6. Keep paragraphs short and readable
7. Use proper spacing for readability

Always be encouraging but factual, and prioritize medical accuracy.`;

const WELCOME_MESSAGE = `
# 👋 Welcome to Warid

I'm your personal blood donation assistant, here to help you with:
- 🩸 Blood donation information
- 🏥 Finding donation centers
- ⭐ Donor rank system
- ❓ Eligibility questions
- 📋 Donation process
- 🎮 LifePoints tracking

**How can I assist you today?**

You can ask me in:
- 🇲🇦 العربية
- 🇫🇷 Français
- 🇬🇧 English
`;

export const BloodDonationChatbot: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    try {
      setMessages(prev => [...prev, { role: 'user', content: message }]);
      setIsLoading(true);

      // Detect language and add it to the system prompt
      const detectedLang = detectLanguage(message);
      const langPrompt = `The user is writing in ${detectedLang === 'ar' ? 'Arabic' : detectedLang === 'fr' ? 'French' : 'English'}. You MUST respond in the same language.`;

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
              role: 'system',
              content: SYSTEM_PROMPT + '\n\n' + langPrompt
            },
            ...messages,
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat API Error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content;
      
      if (!aiMessage) {
        console.warn('Unexpected API response format:', data);
        throw new Error('Invalid response format from API');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again or rephrase your question.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleLocationClick = (location: string) => {
    console.log('Location clicked:', location);
    setSelectedLocation(location);
  };

  const isLocationText = (text: string): boolean => {
    const locationKeywords = [
      'Centre', 'Center', 'Hospital', 'Clinic', 'Medical',
      'مستشفى', 'مركز', 'عيادة', // Arabic keywords
      'Hôpital', 'Clinique', 'Centre médical' // French keywords
    ];
    return locationKeywords.some(keyword => text.includes(keyword));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-lg shadow-lg w-80 md:w-96 h-[500px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-blood text-white rounded-t-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Warid Assistant
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:text-white/80"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-blood text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-md font-bold mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        strong: ({ node, ...props }) => {
                          const text = props.children?.[0]?.toString() || '';
                          const isLocation = isLocationText(text);
                          return (
                            <strong
                              className={`font-bold ${
                                isLocation 
                                  ? 'cursor-pointer hover:underline text-blood dark:text-blood-light flex items-center gap-1' 
                                  : ''
                              }`}
                              onClick={() => {
                                if (isLocation) {
                                  console.log('Clicking location:', text);
                                  handleLocationClick(text);
                                }
                              }}
                              {...props}
                            >
                              {text}
                              {isLocation && <MapPin className="h-4 w-4 inline-block" />}
                            </strong>
                          );
                        },
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                    {selectedLocation && msg.content.includes(selectedLocation) && (
                      <div className="mt-2 relative">
                        <div className="absolute -top-2 left-0 right-0 h-4 bg-gradient-to-b from-muted to-transparent" />
                        <GoogleMapsEmbed location={selectedLocation} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted max-w-[80%] rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={t("chat.placeholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleSend(input)} 
                disabled={isLoading || !input.trim()}
                className="bg-blood hover:bg-blood-dark text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blood hover:bg-blood-dark text-white rounded-full h-12 w-12 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default BloodDonationChatbot; 