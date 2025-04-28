import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LocationPrompt from "@/components/LocationPrompt";
import ChatbotButton from "@/components/ChatbotButton";
import BloodDonationChatbot from "@/components/BloodDonationChatbot";
import EligibilityChecker from "@/components/EligibilityChecker";
import { testAIAPI } from "@/utils/apiService";
import { Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationCentersList } from '@/components/DonationCentersList';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import LoadingProgress from '@/components/LoadingProgress';

// Import old pages
const HomePage = () => {
  const { t } = useLanguage();
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // Test API connection on initial load
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await testAIAPI();
        setApiConnected(true);
        console.log("API test response:", response);
      } catch (error) {
        setApiConnected(false);
        console.error("API connection failed:", error);
      }
    };
    
    testAPI();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {apiConnected === false && (
        <div className="bg-yellow-100 p-2 text-center text-yellow-800 text-sm">
          {t("app.apiError")}
        </div>
      )}

      {!location ? (
        <div className="flex justify-center items-center flex-1">
          <LocationPrompt onLocationSelected={setLocation} />
        </div>
      ) : (
        <div className="flex-1 container mx-auto px-4 py-6 mt-16">
          <Tabs defaultValue="hospitals" className="w-full">
            <TabsList className="w-full justify-center mb-6">
              <TabsTrigger value="hospitals">Find Donation Centers</TabsTrigger>
              <TabsTrigger value="eligibility">Check Eligibility</TabsTrigger>
            </TabsList>

            <TabsContent value="hospitals">
              <h2 className="text-2xl font-bold mb-6">
                Nearby Blood Donation Centers in {location.city}
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 text-blood animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <AlertTriangle className="h-10 w-10 text-blood mx-auto mb-2" />
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <DonationCentersList userLocation={location} />
              )}
            </TabsContent>

            <TabsContent value="eligibility">
              <EligibilityChecker />
            </TabsContent>
          </Tabs>
        </div>
      )}

      <BloodDonationChatbot />
    </div>
  );
};

// Wrapper components for old pages
const OldPageWrapper = ({ src, title }: { src: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setError('Failed to load page. Please try again.');
    };

    return () => {
      // Cleanup
      setIsLoading(true);
      setError(null);
    };
  }, [src]);

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LoadingProgress />
      <Navbar />
      <motion.div 
        className="mt-16"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {isLoading && (
          <motion.div 
            className="flex justify-center items-center h-[calc(100vh-4rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-8 w-8 text-blood animate-spin" />
          </motion.div>
        )}
        {error && (
          <motion.div 
            className="flex justify-center items-center h-[calc(100vh-4rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 text-blood mx-auto mb-2" />
              <p className="text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-blood text-blood hover:bg-blood hover:text-white"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </motion.div>
        )}
        <motion.iframe 
          src={src}
          className={`w-full h-[calc(100vh-4rem)] ${isLoading || error ? 'hidden' : 'block'}`}
          title={title}
          onLoad={() => setIsLoading(false)}
          onError={() => setError('Failed to load page. Please try again.')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </motion.div>
      <ScrollToTop />
    </motion.div>
  );
};

const ProfilePage = () => (
  <OldPageWrapper src="/profile.html" title="Profile Page" />
);

const LeaderboardPage = () => (
  <OldPageWrapper src="/LB.html" title="Leaderboard Page" />
);

const SignInPage = () => (
  <OldPageWrapper src="/signin.html" title="Sign In Page" />
);

const Index = () => {
  const location = useLocation();
  const path = location.pathname;

  const getPageComponent = () => {
    switch (path) {
      case '/':
        return <HomePage />;
      case '/profile':
        return <ProfilePage />;
      case '/leaderboard':
        return <LeaderboardPage />;
      case '/signin':
        return <SignInPage />;
      case '/signup':
        return <OldPageWrapper src="/signin.html" title="Sign Up Page" />;
      case '/emergency':
        return <OldPageWrapper src="/home.html" title="Emergency Page" />;
      case '/about':
        return <OldPageWrapper src="/home.html" title="About Page" />;
      case '/contact':
        return <OldPageWrapper src="/home.html" title="Contact Page" />;
      case '/request':
        return <OldPageWrapper src="/home.html" title="Request Page" />;
      case '/centers':
        return <OldPageWrapper src="/home.html" title="Centers Page" />;
      case '/support':
        return <OldPageWrapper src="/home.html" title="Support Page" />;
      case '/privacy':
        return <OldPageWrapper src="/home.html" title="Privacy Page" />;
      case '/terms':
        return <OldPageWrapper src="/home.html" title="Terms Page" />;
      case '/faq':
        return <OldPageWrapper src="/home.html" title="FAQ Page" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {getPageComponent()}
    </AnimatePresence>
  );
};

export default Index;
