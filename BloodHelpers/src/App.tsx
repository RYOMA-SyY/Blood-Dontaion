import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from '@/contexts/NotificationContext';
import DocsPage from './pages/DocsPage';
import DonatePage from './pages/DonatePage';

const queryClient = new QueryClient();

// Configure future flags for React Router
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={routerFutureConfig}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/docs/*" element={<DocsPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/profile" element={<Index />} />
              <Route path="/leaderboard" element={<Index />} />
              <Route path="/signin" element={<Index />} />
              <Route path="/signup" element={<Index />} />
              <Route path="/emergency" element={<Index />} />
              <Route path="/about" element={<Index />} />
              <Route path="/contact" element={<Index />} />
              <Route path="/request" element={<Index />} />
              <Route path="/centers" element={<Index />} />
              <Route path="/support" element={<Index />} />
              <Route path="/privacy" element={<Index />} />
              <Route path="/terms" element={<Index />} />
              <Route path="/faq" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
