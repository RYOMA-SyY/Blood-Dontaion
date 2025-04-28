import React, { useState, useRef, useEffect } from "react";
import { DropletIcon, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const OPENROUTER_API_KEY = "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";
const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm the Blood Helpers assistant. How can I help you with your blood donation questions today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepare conversation history for the AI
      const conversation = messages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      }));

      // Add user's latest message
      conversation.push({
        role: "user",
        content: inputMessage
      });

      // Include system prompt to provide context
      conversation.unshift({
        role: "system",
        content: "You are BloodHelper AI, a helpful assistant for blood donation. Provide accurate, friendly, and concise information about blood donation in Morocco. Answer questions about eligibility, process, benefits, and address common concerns. You should encourage donation when appropriate but be factual about requirements and contraindications."
      });

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.href,
          "X-Title": "Blood Helpers Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "anthropic/claude-3-sonnet:beta",
          "messages": [
            {
              "role": "system",
              "content": "You are BloodHelper AI, a helpful assistant for blood donation. Provide accurate, friendly, and concise information about blood donation in Morocco. Answer questions about eligibility, process, benefits, and address common concerns. You should encourage donation when appropriate but be factual about requirements and contraindications."
            },
            ...conversation,
            {
              "role": "user", 
              "content": inputMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now.";

      // Add AI message to chat
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Could not connect to the assistant. Please try again later.");
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center">
        <DropletIcon className="h-5 w-5 text-blood mr-2" />
        <h3 className="text-lg font-bold">Blood Helpers Assistant</h3>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-gray-800 text-white rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-white rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-ping delay-75" />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-ping delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type your question..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-primary text-white p-2 rounded-lg disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
