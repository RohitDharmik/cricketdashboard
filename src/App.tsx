import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MatchProvider } from "@/context/MatchContext";
import Index from "./pages/Index";
import MatchSetup from "./pages/MatchSetup";
import TossPage from "./pages/TossPage";
import LiveScorecard from "./pages/LiveScorecard";
import MatchSummary from "./pages/MatchSummary";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MatchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/setup" element={<MatchSetup />} />
            <Route path="/toss" element={<TossPage />} />
            <Route path="/live" element={<LiveScorecard />} />
            <Route path="/summary" element={<MatchSummary />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
