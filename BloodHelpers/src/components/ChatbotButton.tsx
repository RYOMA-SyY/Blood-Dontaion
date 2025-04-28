
import React from "react";
import { MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Chatbot from "./Chatbot";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const ChatbotButton: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end z-50">
      <LanguageSwitcher />
      
      <Sheet>
        <SheetTrigger asChild>
          <button
            aria-label={t("chat.title")}
            className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:w-[400px] sm:max-w-md border-l p-0">
          <Chatbot />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatbotButton;
