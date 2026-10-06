import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Assess from "./pages/Assess";
import Results from "./pages/Results";
import History from "./pages/History";
import Settings from "./pages/Settings";
import ModelLab from "./pages/ModelLab";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import AuthGate from "@/components/AuthGate";
import ProfileSetup from "@/components/ProfileSetup";
import UploadFiles from "./pages/UploadFiles";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading, isAuthenticated } = useAuth();
  const profileQuery = trpc.profile.mine.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {loading ? <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-sm text-white/45">Connecting your MediRisk workspace…</div> : !user ? <AuthGate /> : <div className="max-w-md mx-auto min-h-screen bg-[#0A0A0A] relative">
            {activeTab === "home" && <Home key="home" onTabChange={handleTabChange} patientName={profileQuery.data?.displayName || user.name || "Member"} />}
            {activeTab === "assess" && <Assess key="assess" onTabChange={handleTabChange} patientName={profileQuery.data?.displayName || user.name || "Member"} />}
            {activeTab === "results" && <Results key="results" onTabChange={handleTabChange} />}
            {activeTab === "upload" && <UploadFiles key="upload" onTabChange={handleTabChange} />}
            {activeTab === "history" && <History key="history" onTabChange={handleTabChange} />}
            {activeTab === "settings" && <Settings key="settings" onTabChange={handleTabChange} />}
            {activeTab === "lab" && <ModelLab key="lab" onTabChange={handleTabChange} />}
            {!profileQuery.isLoading && !profileQuery.data && <ProfileSetup defaultName={user.name || "Member"} onComplete={() => profileQuery.refetch()} />}
          </div>}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
