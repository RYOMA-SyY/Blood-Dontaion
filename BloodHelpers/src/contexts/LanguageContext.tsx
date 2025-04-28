import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr" | "ar";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    "app.title": "Warid",
    "app.footer": "BOTTOM FRAGS | OpportunAI Hackathon",
    "app.apiError": "AI API connection failed. Using fallback data.",
    "location.title": "Find Blood Donation Centers Near You",
    "location.button": "Use My Location",
    "location.or": "or",
    "location.select": "Select a City",
    "hospitals.title": "Nearby Blood Donation Centers in",
    "hospital.bloodNeeded": "Blood Types Needed:",
    "hospital.demand": "Real-time Blood Demand",
    "hospital.demandDesc": "Every 2 minutes, a Moroccan needs blood. YOU can change that.",
    "hospital.select": "Select a hospital to see more details",
    "donate.button": "I Want to Donate",
    "donate.success": "Thank you for donating!",
    "chat.placeholder": "Ask about blood donation...",
    "chat.send": "Send",
    "chat.title": "Blood Donation Chatbot"
  },
  fr: {
    "app.title": "Warid",
    "app.footer": "BOTTOM FRAGS | OpportunAI Hackathon",
    "app.apiError": "Échec de la connexion à l'API IA. Utilisation des données de secours.",
    "location.title": "Trouvez des centres de don de sang près de chez vous",
    "location.button": "Utiliser ma position",
    "location.or": "ou",
    "location.select": "Sélectionnez une ville",
    "hospitals.title": "Centres de don de sang à proximité de",
    "hospital.bloodNeeded": "Types de sang nécessaires:",
    "hospital.demand": "Demande de sang en temps réel",
    "hospital.demandDesc": "Toutes les 2 minutes, un Marocain a besoin de sang. VOUS pouvez changer cela.",
    "hospital.select": "Sélectionnez un hôpital pour voir plus de détails",
    "donate.button": "Je veux faire un don",
    "donate.success": "Merci pour votre don!",
    "chat.placeholder": "Posez des questions sur le don de sang...",
    "chat.send": "Envoyer",
    "chat.title": "Chatbot de don de sang"
  },
  ar: {
    "app.title": "وريد",
    "app.footer": "BOTTOM FRAGS | OpportunAI Hackathon",
    "app.apiError": "فشل الاتصال بواجهة برمجة تطبيقات الذكاء الاصطناعي. استخدام البيانات الاحتياطية.",
    "location.title": "ابحث عن مراكز التبرع بالدم بالقرب منك",
    "location.button": "استخدم موقعي",
    "location.or": "أو",
    "location.select": "اختر مدينة",
    "hospitals.title": "مراكز التبرع بالدم القريبة في",
    "hospital.bloodNeeded": "فصائل الدم المطلوبة:",
    "hospital.demand": "الطلب على الدم في الوقت الفعلي",
    "hospital.demandDesc": "كل دقيقتين، يحتاج مغربي إلى الدم. يمكنك أن تُحدث فرقاً.",
    "hospital.select": "اختر مستشفى لرؤية المزيد من التفاصيل",
    "donate.button": "أريد التبرع",
    "donate.success": "شكراً على تبرعك!",
    "chat.placeholder": "اسأل عن التبرع بالدم...",
    "chat.send": "إرسال",
    "chat.title": "روبوت محادثة التبرع بالدم"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => ""
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("blood-helpers-language") as Language;
    return savedLanguage || "en";
  });

  useEffect(() => {
    localStorage.setItem("blood-helpers-language", language);
    
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    
    // Add language-specific class to body for additional styling if needed
    document.body.className = `lang-${language}`;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
