import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Hospital } from "./HospitalCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonateButtonProps {
  hospital: Hospital;
}

const DonateButton: React.FC<DonateButtonProps> = ({ hospital }) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDonate = () => {
    // In a real app, this would connect to a backend to schedule the donation
    toast({
      title: t("donate.success"),
      description: `Thank you for choosing to donate at ${hospital.name}. The hospital will contact you shortly.`,
      duration: 5000,
    });
  };

  return (
    <Button
      className="w-full bg-blood hover:bg-blood-dark text-white"
      onClick={handleDonate}
    >
      {t("donate.button")}
    </Button>
  );
};

export default DonateButton;
