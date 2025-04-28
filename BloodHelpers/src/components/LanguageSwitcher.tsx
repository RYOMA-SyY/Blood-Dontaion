
import React from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "ar", name: "العربية" }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full text-sm transition-colors text-white">
        <Globe className="h-4 w-4" />
        <span>{currentLanguage?.name}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`text-sm cursor-pointer ${
              language === lang.code ? "bg-gray-800" : ""
            } hover:bg-gray-800`}
            onClick={() => setLanguage(lang.code as "en" | "fr" | "ar")}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
