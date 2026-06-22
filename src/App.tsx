import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Globe, RefreshCw, Calendar, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "./store/useStore";
import { useThemeEngine } from "./hooks/useThemeEngine";
import HeroSection from "./components/HeroSection";
import SettingsModal from "./components/SettingsModal";
import GuideModal from "./components/GuideModal";
import DailyStatus from "./components/DailyStatus";

export default function App() {
  const { settings, user, images, imageTransitionSpeed } = useStore();
  const { currentTheme } = useThemeEngine();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle HTMl dark mode class based on settings and time
  useEffect(() => {
    let isDark = settings.theme === "dark";
    if (settings.theme === "auto") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    
    // Automatically apply dark mode if moon/night theme is active
    if (currentTheme === "moon") {
      isDark = true;
    }

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme, currentTheme]);

  // Handle background image transition
  useEffect(() => {
    if (images.length === 0 || !settings.showBackgroundImages) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, imageTransitionSpeed * 1000);
    return () => clearInterval(interval);
  }, [images.length, imageTransitionSpeed, settings.showBackgroundImages]);

  return (
    <div className="relative min-h-screen bg-[#f5f6f8] dark:bg-slate-900 transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Absolute Background Image Layer */}
      {settings.showBackgroundImages && images.length > 0 && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <AnimatePresence>
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-[4px] z-10" />
        </div>
      )}

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Navigation Bar */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center px-4 md:px-8 py-3">
           <div className="flex items-center">
             <button
                onClick={() => setIsGuideOpen(true)}
                className="p-2 mr-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 transition-all hover:scale-110 active:scale-95 group"
                title="Application Guide"
              >
                <HelpCircle className="w-5 h-5 group-hover:animate-pulse" />
             </button>
           </div>
           <div className="flex items-center justify-end w-full sm:w-auto">
             <div className="flex items-center space-x-3 border-slate-200 dark:border-slate-700">
             <div className="w-10 h-10 bg-[#0a2357] text-white rounded-full flex items-center justify-center font-semibold text-lg">
               {user.name.charAt(0)}
             </div>
             <div className="flex flex-col text-sm hidden sm:flex">
               <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
               <span className="text-slate-500 text-xs text-right opacity-80">{user.id.replace('EMP-', '')}</span>
             </div>
             <button 
                onClick={() => setIsSettingsOpen(true)} 
                className="ml-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors"
                title="Settings"
             >
               <SettingsIcon className="w-5 h-5" />
             </button>
           </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto w-full px-4 sm:px-6 py-6 pb-24 flex-1">

        {/* Title Bar */}
        <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-700 pb-3 mb-6 mt-4">
          <h1 className="text-xl font-bold text-[#0c3176] dark:text-blue-400">Attendance</h1>
          <button 
            onClick={() => useStore.getState().triggerRefresh()}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5"/>
          </button>
        </div>

        {/* Shift Banner */}
        <div className="bg-[#0b2b6b] text-white rounded-lg p-4 flex items-center space-x-3 mb-10 shadow-md border border-[#061e52] dark:border-slate-800">
          <Calendar className="w-6 h-6" />
          <span className="font-medium text-sm md:text-base">Today Shift Assign : Normal 9 - 17</span>
        </div>

        {/* Center Dashboard Area */}
        <div className="flex flex-col items-center">
          <HeroSection />
          
          <DailyStatus />
          
          <button className="text-blue-700 dark:text-blue-400 mt-8 mb-8 hover:underline font-medium text-sm md:text-base cursor-pointer">
            View All Attendance
          </button>
        </div>
      </div>
      
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}

