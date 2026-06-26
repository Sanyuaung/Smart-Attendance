import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Globe, RefreshCw, Calendar, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "./store/useStore";
import { useThemeEngine } from "./hooks/useThemeEngine";
import HeroSection from "./components/HeroSection";
import SettingsModal from "./components/SettingsModal";
import GuideModal from "./components/GuideModal";
import DailyStatus from "./components/DailyStatus";
import { useWeatherLocation } from "./hooks/useWeatherLocation";
import WeatherBannerBackground from "./components/WeatherBannerBackground";
import CPODashboard from "./components/CPODashboard";

export default function App() {
  const { settings, user, images, imageTransitionSpeed } = useStore();
  const { currentTheme } = useThemeEngine();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const { condition, isDay } = useWeatherLocation();

  // Greeting cycling
  const greetings = settings.customGreetings && settings.customGreetings.length > 0 
    ? settings.customGreetings 
    : ["Good Morning", "Good Afternoon", "Good Evening"];

  useEffect(() => {
    if (!settings.customGreetingsEnabled || greetings.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, (settings.greetingTransitionSpeed || 3) * 1000);
    return () => clearInterval(interval);
  }, [greetings.length, settings.greetingTransitionSpeed, settings.customGreetingsEnabled]);

  // Greeting text calculation
  const getDynamicGreetingText = () => {
    if (settings.customGreetingsEnabled) {
      const g = greetings[currentGreetingIndex % greetings.length] || "Welcome Page";
      // Try to extract emoji at the end
      const match = g.match(/^(.*?)\s*([\p{Emoji_Presentation}\p{Extended_Pictographic}]+)?$/u);
      return {
        text: match?.[1] || g,
        emoji: match?.[2] || ""
      };
    } else {
      const hour = new Date().getHours();
      if (hour < 12) return { text: "Good Morning", emoji: "🌤️" };
      if (hour < 18) return { text: "Good Afternoon", emoji: "☀️" };
      return { text: "Good Evening", emoji: "🌙" };
    }
  };

  const activeGreeting = getDynamicGreetingText();

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
             <div className="flex items-center space-x-5">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="font-extrabold text-[15px] text-slate-900 dark:text-white tracking-tight leading-none mb-1.5 uppercase">{user.name}</span>
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.1em] bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-2 py-0.5 rounded-md leading-none">{user.department}</span>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mr-1 opacity-60">ID</span>
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 leading-none">{user.id.replace('EMP-', '')}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0a2357] via-[#1e3a8a] to-indigo-600 text-white flex items-center justify-center font-black text-xl ring-4 ring-indigo-500/10 shadow-xl transition-all group-hover:scale-105 group-hover:rotate-3 cursor-default overflow-hidden">
                  <span className="relative z-10">{user.name.charAt(0)}</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white dark:border-slate-800 rounded-full shadow-lg z-20" />
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

              <button 
                 onClick={() => setIsSettingsOpen(true)} 
                 className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-90 group"
                 title="System Settings"
              >
                <SettingsIcon className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </div>
      </div>

      {/* Main Content */}
      <div className={`${settings.dashboardViewEnabled && settings.dashboardRole === "CPO" ? "w-full max-w-none px-4 md:px-8 xl:px-12" : "max-w-[1000px] mx-auto w-full px-4 sm:px-6"} py-6 pb-24 flex-1`}>

        {/* Title Bar */}
        {!(settings.dashboardViewEnabled && settings.dashboardRole === "CPO") && (
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
        )}

        {/* Shift Banner */}
        <div className="text-white rounded-xl p-4 flex items-center justify-between mb-10 shadow-md border border-[#061e52] dark:border-slate-800 overflow-hidden relative min-h-[56px]">
          <WeatherBannerBackground condition={condition} isDay={isDay} />
          
          <div className="flex items-center space-x-3.5 z-10 drop-shadow-md">
            <div className="flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGreeting.text + activeGreeting.emoji}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="font-semibold text-sm md:text-base flex items-center space-x-2"
                >
                  <span>
                    {activeGreeting.text.toLowerCase().includes("shift") || activeGreeting.text.toLowerCase().includes("calendar")
                      ? activeGreeting.text
                      : `${activeGreeting.text}, ${user.name.split(' ')[0]}`
                    }
                  </span>
                  {activeGreeting.emoji && (
                    <span className="inline-block transform origin-bottom hover:rotate-12 transition-transform select-none">
                      {activeGreeting.emoji}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-10" />
        </div>

        {/* Center Dashboard Area */}
        {settings.dashboardViewEnabled && settings.dashboardRole === "CPO" ? (
          <CPODashboard />
        ) : settings.dashboardViewEnabled && settings.dashboardRole !== "Standard" ? (
          <div className="w-full max-w-7xl mx-auto px-4 text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-12">
            <span className="text-4xl">🏢</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-3">
              {settings.dashboardRole === "Head Level" ? "Head Level Executive View" : "Department Manager View"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              This dashboard view is currently under audit clearance. To preview fully functional HR analytics, regulatory compliance, exit insights, performance tracking, and branch readiness grids, open settings and set the role to <span className="font-semibold text-indigo-600 dark:text-indigo-400">Chief People Officer (CPO) View</span>.
            </p>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition"
            >
              Open Settings & Select CPO
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <HeroSection />
            
            <DailyStatus />
            
            <button className="text-blue-700 dark:text-blue-400 mt-8 mb-8 hover:underline font-medium text-sm md:text-base cursor-pointer">
              View All Attendance
            </button>
          </div>
        )}
      </div>
      
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
