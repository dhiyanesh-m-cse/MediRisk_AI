/**
 * BottomNav - Mobile bottom navigation bar
 * Design: Crimson Pulse — dark bar with crimson active indicator
 */
import { Home, ClipboardList, Settings, Activity, Upload } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "assess", label: "Assess", icon: Activity },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "history", label: "History", icon: ClipboardList },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#0A0A0A]/95 backdrop-blur-xl">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 relative"
            >
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-red-600" />
              )}
              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-red-500"
                    : "text-white/40"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-red-500"
                    : "text-white/40"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
