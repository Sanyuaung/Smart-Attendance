import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, AttendanceRecord, AttendanceStatus, Settings, UserProfile } from "../types";

const defaultUser: UserProfile = {
  name: "San Yu Aung",
  id: "EMP-029018",
  department: "F21 Software & Data Analytics",
  shiftStart: "09:00 AM",
  shiftEnd: "05:00 PM",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
};

const defaultSettings: Settings = {
  theme: "auto",
  animationsEnabled: true,
  themeOverride: "auto",
  themeEmojis: {
    valentine: "❤️ 💖",
    thadingyut: "🎈 🏮",
    thingyan: "💦 💧",
    christmas: "❄️ ⛄",
    moon: "🌙 ✨",
    custom: "✨ 🍭 🎉",
    none: "✨ 🌟",
  },
  moonThemeEnabled: true,
  moonThemeStartTime: "19:00",
  soundEnabled: true,
  showWeather: true,
  showLocation: true,
  showBackgroundImages: true,
  customGreetingsEnabled: true,
  customGreetings: ["Have a great day!", "Stay positive!", "Keep up the good work!", "You are doing awesome!", "A successful day ahead!"],
  greetingTransitionSpeed: 3,
  moonCustomDateEnabled: false,
  moonCustomDate: "2026-06-19",
  particleCount: 60,
  particleMinSpeed: 2,
  particleMaxSpeed: 5,
  particleDirection: "default",
  ripplePulseDuration: 3,
  buttonHoverZoom: 1.03,
  particleSpinSpeed: "medium",
  particleScaleMin: 0.5,
  particleScaleMax: 1.5,
  rippleGlowColor: "indigo",
  particleFadeMode: "both",
  customThemeName: "My Gala Festival",
  customThemeIcon: "Sparkles",
  customThemeBaseColor: "bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 border-indigo-300",
  customThemeRippleColor: "bg-indigo-500/20",
  customThemeShape: "rounded-full",
  customThemeInteractiveEffect: "pulse",
  customThemes: [
    {
      id: "neon-cyber",
      name: "Neon Cyberpunk",
      icon: "Zap",
      baseColor: "bg-gradient-to-b from-[#120c1f] via-[#241442] to-[#7a1c7c] border-[#ff2a74]",
      rippleColor: "bg-[#ff2a74]/20",
      shape: "rounded-3xl",
      interactiveEffect: "pulse",
      emojis: "⚡ 🔮 👾 🌌",
    },
    {
      id: "sunset-fiesta",
      name: "Sunset Fiesta",
      icon: "Music",
      baseColor: "bg-gradient-to-b from-orange-500 via-red-500 to-pink-600 border-amber-300",
      rippleColor: "bg-orange-500/20",
      shape: "rounded-full",
      interactiveEffect: "bounce",
      emojis: "🎸 🥁 🌮 🍹 💃",
    },
    {
      id: "emerald-zen",
      name: "Emerald Wood",
      icon: "TreePine",
      baseColor: "bg-gradient-to-b from-emerald-800 to-teal-950 border-emerald-400",
      rippleColor: "bg-emerald-500/10",
      shape: "rounded-xl",
      interactiveEffect: "none",
      emojis: "🌲 🍃 🍵 🏮 🧘",
    }
  ],
  selectedCustomThemeId: "neon-cyber",
};

const defaultImages = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200"
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: defaultUser,
      status: "Checked In",
      records: [],
      images: defaultImages,
      settings: defaultSettings,
      imageTransitionSpeed: 10,
      lastRefresh: Date.now(),

      checkIn: (record) => set((state) => ({
        status: "Checked In",
        records: [record, ...state.records]
      })),
      
      checkOut: (record) => set((state) => ({
        status: "Checked Out",
        records: [record, ...state.records]
      })),

      clearRecords: () => set({ records: [], status: "Checked In" }),
      
      triggerRefresh: () => set({ lastRefresh: Date.now() }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      addImage: (url) => set((state) => ({ images: [...state.images, url] })),
      
      removeImage: (index) => set((state) => ({
        images: state.images.filter((_, i) => i !== index)
      })),

      setImages: (images) => set({ images }),

      setImageTransitionSpeed: (speed) => set({ imageTransitionSpeed: speed })
    }),
    {
      name: "smart-attendance-storage",
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== 'user')
      ) as any,
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        user: currentState.user,
      }),
    }
  )
);

