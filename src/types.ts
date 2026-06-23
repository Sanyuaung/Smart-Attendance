export type AttendanceStatus = "Checked In" | "Checked Out" | "Late" | "Absent";

export type ThemeOverride = "auto" | "none" | "valentine" | "thadingyut" | "thingyan" | "christmas" | "moon" | "custom";

export interface AttendanceRecord {
  id: string;
  type: "in" | "out";
  timestamp: number;
  location?: { lat: number; lng: number; address: string };
  hoursSoFar?: number;
}

export interface UserProfile {
  name: string;
  id: string;
  department: string;
  shiftStart: string; // "09:00 AM"
  shiftEnd: string;   // "05:00 PM"
  avatar: string;
}

export interface CustomThemeDefinition {
  id: string;
  name: string;
  icon: string;
  baseColor: string;
  rippleColor: string;
  shape: "rounded-full" | "rounded-3xl" | "rounded-xl" | "rounded-none";
  interactiveEffect: "bounce" | "pulse" | "spin" | "wiggle" | "none";
  emojis: string;
}

export interface Settings {
  theme: "light" | "dark" | "auto";
  animationsEnabled: boolean;
  themeOverride: ThemeOverride;
  themeEmojis: Record<string, string>;
  moonThemeEnabled: boolean;
  moonThemeStartTime: string;
  moonThemeOverrideId?: string;
  soundEnabled: boolean;
  showWeather: boolean;
  showLocation: boolean;
  showBackgroundImages: boolean;
  customGreetingsEnabled: boolean;
  customGreetings: string[];
  greetingTransitionSpeed: number;
  moonCustomDateEnabled: boolean;
  moonCustomDate: string;
  particleCount?: number;
  particleMinSpeed?: number;
  particleMaxSpeed?: number;
  particleDirection?: "default" | "falling" | "rising" | "explode";
  ripplePulseDuration?: number;
  buttonHoverZoom?: number;
  particleSpinSpeed?: "none" | "slow" | "medium" | "fast" | "random";
  particleScaleMin?: number;
  particleScaleMax?: number;
  rippleGlowColor?: string;
  particleFadeMode?: "fade" | "scale" | "both" | "none";
  customThemeName?: string;
  customThemeIcon?: string;
  customThemeBaseColor?: string;
  customThemeRippleColor?: string;
  customThemeShape?: "rounded-full" | "rounded-3xl" | "rounded-xl" | "rounded-none";
  customThemeInteractiveEffect?: "bounce" | "pulse" | "spin" | "wiggle" | "none";
  customThemes?: CustomThemeDefinition[];
  selectedCustomThemeId?: string;
  moonCustomPhases?: Record<string, { image?: string, description?: string, customThemeId?: string, particleEmojis?: string }>;
}

export interface AppState {
  // User Profile
  user: UserProfile;
  // State
  status: AttendanceStatus;
  records: AttendanceRecord[];
  images: string[];
  settings: Settings;
  imageTransitionSpeed: number;
  lastRefresh: number;
  
  // Actions
  checkIn: (record: AttendanceRecord) => void;
  checkOut: (record: AttendanceRecord) => void;
  clearRecords: () => void;
  triggerRefresh: () => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
  setImages: (images: string[]) => void;
  setImageTransitionSpeed: (speed: number) => void;
}
