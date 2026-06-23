import { useStore } from "../store/useStore";
import { X, Plus, Trash2, Image as ImageIcon, Sliders, Calendar, Sparkles, Moon, Eye, Edit, Check, RotateCcw, Palette, Layout, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Settings } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { 
    settings, 
    updateSettings, 
    images, 
    setImages, 
    imageTransitionSpeed, 
    setImageTransitionSpeed 
  } = useStore();

  // Local draft states
  const [localSettings, setLocalSettings] = useState<Settings>({ ...settings });
  const [localImages, setLocalImages] = useState<string[]>([...images]);
  const [localImageTransitionSpeed, setLocalImageTransitionSpeed] = useState<number>(imageTransitionSpeed);
  
  const [newImgUrl, setNewImgUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // CRUD states for Custom Theme Creator
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [formThemeName, setFormThemeName] = useState("");
  const [formThemeIcon, setFormThemeIcon] = useState("Sparkles");
  const [formThemeBaseColor, setFormThemeBaseColor] = useState("border-indigo-300 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500");
  const [formThemeRippleColor, setFormThemeRippleColor] = useState("bg-indigo-500/10");
  const [formThemeShape, setFormThemeShape] = useState<"rounded-full" | "rounded-3xl" | "rounded-xl" | "rounded-none">("rounded-full");
  const [formThemeInteractiveEffect, setFormThemeInteractiveEffect] = useState<"bounce" | "pulse" | "spin" | "wiggle" | "none">("pulse");
  const [formThemeEmojis, setFormThemeEmojis] = useState("✨ 🍭 🎉");

  const [confirmClear, setConfirmClear] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"general" | "themes" | "particles" | "night" | "backgrounds">("general");

  // Custom Simulated Calendar States
  const [viewMonth, setViewMonth] = useState<number>(6);
  const [viewYear, setViewYear] = useState<number>(2026);

  const resetThemeForm = () => {
    setEditingThemeId(null);
    setFormThemeName("");
    setFormThemeIcon("Sparkles");
    setFormThemeBaseColor("border-indigo-300 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500");
    setFormThemeRippleColor("bg-indigo-500/10");
    setFormThemeShape("rounded-full");
    setFormThemeInteractiveEffect("pulse");
    setFormThemeEmojis("✨ 🍭 🎉");
  };

  const loadThemeIntoForm = (theme: any) => {
    setEditingThemeId(theme.id);
    setFormThemeName(theme.name);
    setFormThemeIcon(theme.icon);
    setFormThemeBaseColor(theme.baseColor);
    setFormThemeRippleColor(theme.rippleColor);
    setFormThemeShape(theme.shape);
    setFormThemeInteractiveEffect(theme.interactiveEffect);
    setFormThemeEmojis(theme.emojis || "✨");
  };

  const handleCreateOrUpdateTheme = () => {
    if (!formThemeName.trim()) {
      setErrorMessage("Please style a name for the custom theme.");
      return;
    }
    
    const themesList = localSettings.customThemes || [];
    
    if (editingThemeId) {
      // Update matching custom theme
      const updatedList = themesList.map(t => {
        if (t.id === editingThemeId) {
          return {
            ...t,
            name: formThemeName.trim(),
            icon: formThemeIcon,
            baseColor: formThemeBaseColor,
            rippleColor: formThemeRippleColor,
            shape: formThemeShape,
            interactiveEffect: formThemeInteractiveEffect,
            emojis: formThemeEmojis,
          };
        }
        return t;
      });
      
      handleUpdateLocalSettings({
        customThemes: updatedList,
        selectedCustomThemeId: editingThemeId,
        customThemeName: formThemeName.trim(),
        customThemeIcon: formThemeIcon,
        customThemeBaseColor: formThemeBaseColor,
        customThemeRippleColor: formThemeRippleColor,
        customThemeShape: formThemeShape,
        customThemeInteractiveEffect: formThemeInteractiveEffect
      });
      setErrorMessage("");
      resetThemeForm();
    } else {
      // Create new theme
      const newThemeId = "custom-" + Date.now();
      const newTheme = {
        id: newThemeId,
        name: formThemeName.trim(),
        icon: formThemeIcon,
        baseColor: formThemeBaseColor,
        rippleColor: formThemeRippleColor,
        shape: formThemeShape,
        interactiveEffect: formThemeInteractiveEffect,
        emojis: formThemeEmojis,
      };
      
      handleUpdateLocalSettings({
        customThemes: [...themesList, newTheme],
        selectedCustomThemeId: newThemeId,
        customThemeName: formThemeName.trim(),
        customThemeIcon: formThemeIcon,
        customThemeBaseColor: formThemeBaseColor,
        customThemeRippleColor: formThemeRippleColor,
        customThemeShape: formThemeShape,
        customThemeInteractiveEffect: formThemeInteractiveEffect
      });
      setErrorMessage("");
      resetThemeForm();
    }
  };

  const handleSelectTheme = (themeId: string) => {
    const theme = (localSettings.customThemes || []).find(t => t.id === themeId);
    if (theme) {
      handleUpdateLocalSettings({
        selectedCustomThemeId: themeId,
        customThemeName: theme.name,
        customThemeIcon: theme.icon,
        customThemeBaseColor: theme.baseColor,
        customThemeRippleColor: theme.rippleColor,
        customThemeShape: theme.shape,
        customThemeInteractiveEffect: theme.interactiveEffect
      });
    }
  };

  const handleDeleteTheme = (themeId: string) => {
    const themesList = localSettings.customThemes || [];
    const updatedList = themesList.filter(t => t.id !== themeId);
    
    let nextSelectedId = localSettings.selectedCustomThemeId;
    if (nextSelectedId === themeId) {
      nextSelectedId = updatedList.length > 0 ? updatedList[0].id : "";
    }
    
    handleUpdateLocalSettings({
      customThemes: updatedList,
      selectedCustomThemeId: nextSelectedId
    });
    
    if (nextSelectedId) {
      const activeTheme = updatedList.find(t => t.id === nextSelectedId);
      if (activeTheme) {
        handleUpdateLocalSettings({
          customThemeName: activeTheme.name,
          customThemeIcon: activeTheme.icon,
          customThemeBaseColor: activeTheme.baseColor,
          customThemeRippleColor: activeTheme.rippleColor,
          customThemeShape: activeTheme.shape,
          customThemeInteractiveEffect: activeTheme.interactiveEffect
        });
      }
    }
    
    if (editingThemeId === themeId) {
      resetThemeForm();
    }
  };

  // Sync draft local states with store when Modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings({ ...settings });
      setLocalImages([...images]);
      setLocalImageTransitionSpeed(imageTransitionSpeed);
      setErrorMessage("");
      setNewImgUrl("");
      resetThemeForm();

      // Sync customized calendar view
      const targetDateStr = settings.moonCustomDate || "2026-06-19";
      const parts = targetDateStr.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (!isNaN(y) && !isNaN(m)) {
          setViewYear(y);
          setViewMonth(m);
        }
      }
    }
  }, [isOpen, settings, images, imageTransitionSpeed]);

  // Synchronise calendar viewing focus whenever active custom date shifts
  useEffect(() => {
    if (localSettings.moonCustomDate) {
      const parts = localSettings.moonCustomDate.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (!isNaN(y) && !isNaN(m)) {
          setViewYear(y);
          setViewMonth(m);
        }
      }
    }
  }, [localSettings.moonCustomDate]);

  if (!isOpen) return null;

  const handleUpdateLocalSettings = (newVal: Partial<Settings>) => {
    setLocalSettings(prev => ({ ...prev, ...newVal }));
  };

  // Custom Inline Calendar Helpers
  const MONTHS_LABELS = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getCalendarCells = () => {
    const cells = [];
    const firstDayIndex = new Date(viewYear, viewMonth - 1, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth - 1, 0).getDate();

    // 1. Padding from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      let prevMonth = viewMonth - 1;
      let prevYear = viewYear;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
      }
      cells.push({
        day: dayNum,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false
      });
    }

    // 2. Current Month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true
      });
    }

    // 3. Padding from next month to make perfectly 42 cells (6 rows of 7 days)
    const remaining = 42 - cells.length;
    for (let n = 1; n <= remaining; n++) {
      let nextMonth = viewMonth + 1;
      let nextYear = viewYear;
      if (nextMonth === 13) {
        nextMonth = 1;
        nextYear += 1;
      }
      cells.push({
        day: n,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false
      });
    }

    return cells;
  };

  const getMoonAgeForCell = (year: number, month: number, day: number) => {
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const msPerDay = 1000 * 60 * 60 * 24;
    const jd = (date.getTime() / msPerDay) + 2440587.5;
    const synodicMonth = 29.53058867;
    const newMoonJD = 2451550.1;
    let age = (jd - newMoonJD) % synodicMonth;
    if (age < 0) {
      age += synodicMonth;
    }
    return age;
  };

  const getMoonSymbolForCell = (year: number, month: number, day: number) => {
    const age = getMoonAgeForCell(year, month, day);
    const phase = (age / 29.53058867) * 8;
    const roundedPhase = Math.round(phase) % 8;
    if (roundedPhase === 0) return "🌑";
    if (roundedPhase === 4) return "🌕";
    return null;
  };

  const getMoonPhaseNameForCell = (year: number, month: number, day: number) => {
    const age = getMoonAgeForCell(year, month, day);
    const phase = (age / 29.53058867) * 8;
    const roundedPhase = Math.round(phase) % 8;

    switch (roundedPhase) {
      case 0: return "New Moon 🌑";
      case 1: return "Waxing Crescent";
      case 2: return "First Quarter";
      case 3: return "Waxing Gibbous";
      case 4: return "Full Moon 🌕";
      case 5: return "Waning Gibbous";
      case 6: return "Third Quarter";
      case 7: return "Waning Crescent";
      default: return "New Moon 🌑";
    }
  };

  const handleCellClick = (year: number, month: number, day: number) => {
    const formattedY = String(year);
    const formattedM = String(month).padStart(2, "0");
    const formattedD = String(day).padStart(2, "0");
    const newDateStr = `${formattedY}-${formattedM}-${formattedD}`;
    handleUpdateLocalSettings({ moonCustomDate: newDateStr });
  };

  const handleAddImage = () => {
    if (!newImgUrl) return;
    if (!newImgUrl.startsWith("http://") && !newImgUrl.startsWith("https://")) {
      setErrorMessage("Please enter a valid HTTP/HTTPS URL");
      return;
    }
    setLocalImages(prev => [...prev, newImgUrl]);
    setNewImgUrl("");
    setErrorMessage("");
  };

  const handleRemoveImage = (idx: number) => {
    if (localImages.length <= 1) {
      setErrorMessage("You must keep at least one background image.");
      return;
    }
    setLocalImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleApplySettings = () => {
    // Commit everything atomically to the global Zustand store
    updateSettings(localSettings);
    setImages(localImages);
    setImageTransitionSpeed(localImageTransitionSpeed);
    onClose();
  };

  // Preset gorgeous backgrounds to make the app easily customizable on demand
  const presetTemplates = [
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=600", // Starry celestial
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600", // Magical nature
    "https://images.unsplash.com/photo-150752428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600", // Sunset sea
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=600"  // Sunny forest
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/45 dark:bg-black/65 backdrop-blur-sm">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose}
      />

      {/* Settings Dialog box */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl mx-4 rounded-3xl shadow-2xl border border-slate-150 dark:border-slate-800 flex flex-col h-[700px] max-h-[90vh] overflow-hidden transition-all transform scale-100 animate-in fade-in-50 zoom-in-95 duration-200 z-10 animate-fade-in">
        
        {/* Header - Sleek & Beautiful */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-sm">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                Applet Settings
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Configure themes, widgets and background sliding effects</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full transition-all focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section - Structured Premium Cards */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-1/3 bg-slate-50/50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-4 space-y-1.5 overflow-y-auto hidden sm:block">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition-colors border ${activeTab === 'general' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-bold shadow-sm' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
            >
              <Eye className={`w-4 h-4 ${activeTab === 'general' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs uppercase tracking-wider">General settings</span>
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition-colors border ${activeTab === 'themes' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-bold shadow-sm' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
            >
              <Palette className={`w-4 h-4 ${activeTab === 'themes' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs uppercase tracking-wider">Custom Themes</span>
            </button>
            <button
              onClick={() => setActiveTab('particles')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition-colors border ${activeTab === 'particles' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-bold shadow-sm' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'particles' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs uppercase tracking-wider">Particles & Effects</span>
            </button>
            <button
              onClick={() => setActiveTab('night')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition-colors border ${activeTab === 'night' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-bold shadow-sm' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
            >
              <Moon className={`w-4 h-4 ${activeTab === 'night' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs uppercase tracking-wider">Auto Night Mode</span>
            </button>
            <button
              onClick={() => setActiveTab('backgrounds')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition-colors border ${activeTab === 'backgrounds' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-bold shadow-sm' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
            >
              <ImageIcon className={`w-4 h-4 ${activeTab === 'backgrounds' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs uppercase tracking-wider">Backgrounds</span>
            </button>
          </div>

          {/* Main Form Content Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30 dark:bg-slate-950/10">

            {/* Mobile Tab Select */}
            <div className="sm:hidden mb-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="general">General Settings</option>
                <option value="themes">Custom Themes</option>
                <option value="particles">Particles & Effects</option>
                <option value="night">Auto Night Mode</option>
                <option value="backgrounds">Background Images</option>
              </select>
            </div>
          
          {/* Appearance card */}
          {activeTab === 'general' && (
            <>
              <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Eye className="w-4 h-4 text-sky-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">Appearance & Styling</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Theme Mode</label>
                <select 
                  value={localSettings.theme} 
                  onChange={(e) => handleUpdateLocalSettings({ theme: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="auto">Auto (System Standard)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Dynamic Theme Override</span>
                  {localSettings.themeOverride && localSettings.themeOverride.startsWith("custom-") && (
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase border border-indigo-500/20">
                      Custom Theme Active
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  <select 
                    value={localSettings.themeOverride} 
                    onChange={(e) => {
                      const val = e.target.value;
                      const updates: Partial<typeof localSettings> = { themeOverride: val };
                      if (val.startsWith("custom-")) {
                        updates.selectedCustomThemeId = val;
                        // Preload selected custom theme settings into the editor
                        const theme = (localSettings.customThemes || []).find(t => t.id === val);
                        if (theme) {
                          loadThemeIntoForm(theme);
                        }
                      } else if (val === "custom") {
                        // Keep current editor fields
                      }
                      handleUpdateLocalSettings(updates);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="auto">Auto Seasonal (Date-based)</option>
                    <option value="none">None (Standard theme)</option>
                    <option value="valentine">Valentine's Day Theme</option>
                    <option value="thadingyut">Thadingyut Festival Theme</option>
                    <option value="thingyan">Thingyan Festival Theme</option>
                    <option value="christmas">Christmas Theme</option>
                    <option value="moon">Moon (Night Theme)</option>
                    <option value="custom">🛠️ Create / Customizer Panel...</option>
                    
                    {/* Render saved Custom Themes inside dropdown */}
                    {(localSettings.customThemes || []).length > 0 && (
                      <optgroup label="Saved Custom Themes 🎨">
                        {(localSettings.customThemes || []).map((theme) => (
                          <option key={theme.id} value={theme.id}>
                            {theme.icon.length <= 3 ? `${theme.icon} ` : "✨ "}{theme.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Enable Transitions & Particles</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.animationsEnabled} 
                  onChange={(e) => handleUpdateLocalSettings({ animationsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Show Weather Indicator</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={localSettings.showWeather} 
                    onChange={(e) => handleUpdateLocalSettings({ showWeather: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
              {localSettings.showWeather && (
                <div className="flex flex-col space-y-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weather Color Accent</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={localSettings.weatherTextColor || "#3b82f6"} 
                      onChange={(e) => handleUpdateLocalSettings({ weatherTextColor: e.target.value })}
                      className="w-7 h-7 rounded-md cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input 
                      type="text" 
                      value={localSettings.weatherTextColor || "#3b82f6"} 
                      onChange={(e) => handleUpdateLocalSettings({ weatherTextColor: e.target.value })}
                      className="w-20 text-[11px] font-mono px-1.5 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300"
                    />
                    <div className="flex items-center gap-1">
                      {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#a855f7", "#ffffff"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleUpdateLocalSettings({ weatherTextColor: color })}
                          className={`w-4.5 h-4.5 rounded-full border border-white/30 shadow-sm transition hover:scale-110 active:scale-95`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Show Location Widget</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={localSettings.showLocation} 
                    onChange={(e) => handleUpdateLocalSettings({ showLocation: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
              {localSettings.showLocation && (
                <div className="flex flex-col space-y-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Location Color Accent</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={localSettings.locationTextColor || "#10b981"} 
                      onChange={(e) => handleUpdateLocalSettings({ locationTextColor: e.target.value })}
                      className="w-7 h-7 rounded-md cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input 
                      type="text" 
                      value={localSettings.locationTextColor || "#10b981"} 
                      onChange={(e) => handleUpdateLocalSettings({ locationTextColor: e.target.value })}
                      className="w-20 text-[11px] font-mono px-1.5 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300"
                    />
                    <div className="flex items-center gap-1">
                      {["#10b981", "#3b82f6", "#eab308", "#f43f5e", "#8b5cf6", "#ffffff"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleUpdateLocalSettings({ locationTextColor: color })}
                          className={`w-4.5 h-4.5 rounded-full border border-white/30 shadow-sm transition hover:scale-110 active:scale-95`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Greeting segment */}
          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">Custom Title Greetings</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.customGreetingsEnabled} 
                  onChange={(e) => handleUpdateLocalSettings({ customGreetingsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>
            
            {localSettings.customGreetingsEnabled ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Cyclical Greeting phrases (one per line)</span>
                    <span className="text-[10px] text-slate-400">Transition: {localSettings.greetingTransitionSpeed || 3}s</span>
                  </div>
                  <textarea 
                    value={(localSettings.customGreetings || []).join('\n')} 
                    onChange={(e) => handleUpdateLocalSettings({ customGreetings: e.target.value.split('\n').filter(g => g.trim().length > 0) })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-3 dark:text-white min-h-[90px] font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Good morning!&#10;Have a great day!"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Greeting Transition Speed (s)</span>
                    <span className="text-[10px] text-slate-400 block">Timing for rotation in seconds</span>
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    max="60"
                    value={localSettings.greetingTransitionSpeed || 3} 
                    onChange={(e) => handleUpdateLocalSettings({ greetingTransitionSpeed: parseInt(e.target.value) || 3 })}
                    className="bg-slate-50 dark:bg-slate-950 border border-[#b2c0cc] dark:border-slate-850 text-xs font-bold rounded-lg p-2 dark:text-white w-16 text-center"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-dashed border-slate-200/50 dark:border-slate-800">
                Disabled. The dashboard banner will automatically display dynamic greetings tailored to the hour: <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">"Good Morning"</span>, <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">"Good Afternoon"</span>, or <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">"Good Evening"</span>. No cycle animation or timed intervals will be active.
              </p>
            )}
          </div>
            </>
          )}

          {/* Custom Theme Creator Card */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              {/* 1. Theme Selection & Applied Custom Theme Specification Panel */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-indigo-500" />
                    <h4 className="font-bold text-[11px] text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Applied Custom Theme Specification Panel</h4>
                  </div>
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-150 dark:border-indigo-900/40">
                    CRUD Theme Base
                  </span>
                </div>

                {/* List of Custom Themes */}
                <div className="grid grid-cols-1 gap-2.5">
                  {(localSettings.customThemes || []).map((theme) => {
                    const isSelected = localSettings.selectedCustomThemeId === theme.id;
                    const isEditing = editingThemeId === theme.id;
                    const infoMapEmoji = theme.emojis || "✨";
                    return (
                      <div 
                        key={theme.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all ${
                          isSelected 
                            ? "bg-indigo-500/5 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-900 shadow-sm" 
                            : "bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {/* Left Info: Avatar-like theme color circular preview and metadata */}
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 ${theme.shape} border-2 ${theme.baseColor} flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}>
                            <span className="text-white text-sm font-black drop-shadow-md select-none">
                              {theme.icon.length <= 3 ? theme.icon : "✨"}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{theme.name}</span>
                              {isSelected && (
                                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-500">
                              <span className="font-semibold bg-slate-100 dark:bg-slate-950 px-1 rounded dark:text-slate-400 capitalize">{theme.shape.replace("rounded-", "")} shape</span>
                              <span>•</span>
                              <span className="font-semibold">FX: <span className="text-indigo-500 font-bold dark:text-indigo-400 capitalize">{theme.interactiveEffect}</span></span>
                              <span>•</span>
                              <span className="tracking-tight">{infoMapEmoji}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Apply, Edit, Delete */}
                        <div className="flex items-center justify-end space-x-1.5 shrink-0">
                          {!isSelected && (
                            <button
                              type="button"
                              onClick={() => handleSelectTheme(theme.id)}
                              className="bg-slate-100 hover:bg-indigo-650 dark:bg-slate-800 dark:hover:bg-indigo-600 text-[10px] text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white font-bold py-1 px-2.5 rounded-lg transition-colors border border-slate-200 dark:border-slate-705 hover:border-indigo-600"
                            >
                              Apply Theme
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => loadThemeIntoForm(theme)}
                            className={`p-1.5 rounded-lg transition-colors border ${
                              isEditing 
                                ? "bg-indigo-600 text-white border-indigo-600" 
                                : "bg-slate-50 hover:bg-slate-105 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                            }`}
                            title="Modify attributes"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="p-1.5 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800/80 dark:hover:bg-rose-955/50 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/50 rounded-lg transition-colors"
                            title="Delete theme"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {(localSettings.customThemes || []).length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium bg-white dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      No custom themes saved yet. Create your first template below!
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Custom Theme Specification Panel - Creation & Edit Form */}
              <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900 shadow-md space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between pb-1 border-b border-indigo-50 dark:border-indigo-950">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <h3 className="font-bold text-indigo-700 dark:text-indigo-400 text-xs uppercase tracking-wider">
                      {editingThemeId ? `Editing spec: ${formThemeName}` : "Create Custom Theme"}
                    </h3>
                  </div>
                  {editingThemeId && (
                    <button 
                      type="button"
                      onClick={resetThemeForm}
                      className="text-[10px] text-indigo-600 hover:text-indigo-805 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center font-bold transition-all"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Add Brand New instead
                    </button>
                  )}
                </div>

                {/* Editor Main Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Custom Theme Descriptor Name</label>
                    <input
                      type="text"
                      value={formThemeName}
                      onChange={(e) => setFormThemeName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white font-medium"
                      placeholder="e.g. My Neon Space, Spring Festival"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Center Button Outline Shape</label>
                    <select
                      value={formThemeShape}
                      onChange={(e) => setFormThemeShape(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white font-medium"
                    >
                      <option value="rounded-full">🦹 Circle (Standard Classic)</option>
                      <option value="rounded-3xl">🎛️ Superellipse (Polished Soft)</option>
                      <option value="rounded-xl">📱 Squircle Card (Rounded Box)</option>
                      <option value="rounded-none">💎 Sharp Diamond (Grid Box)</option>
                    </select>
                  </div>
                </div>

                {/* Icon Selector & Micro-effect */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Center Fingerprint Biometric Icon Override</label>
                    <select
                      value={
                        ["Sparkles", "Star", "Zap", "Coffee", "Gift", "Trophy", "Music", "Rocket", "Heart", "Moon", "TreePine", "Flame", "Droplets", "Smile", "Fingerprint"].includes(formThemeIcon)
                          ? formThemeIcon
                          : (formThemeIcon.startsWith("http://") || formThemeIcon.startsWith("https://") || formThemeIcon.startsWith("data:image/"))
                            ? "custom_image"
                            : "custom_input"
                      }
                      onChange={(e) => {
                        if (e.target.value === "custom_input") {
                          setFormThemeIcon("🦄");
                        } else if (e.target.value === "custom_image") {
                          setFormThemeIcon("https://");
                        } else {
                          setFormThemeIcon(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white font-medium"
                    >
                      <option value="Sparkles">✨ Sparkles</option>
                      <option value="Star">⭐ Glorious Star</option>
                      <option value="Zap">⚡ Cyber Lightning (Zap)</option>
                      <option value="Coffee">☕ High-Voltage Coffee</option>
                      <option value="Gift">🎁 Joyful Holiday Gift</option>
                      <option value="Trophy">🏆 Champ Golden Trophy</option>
                      <option value="Music">🎵 Rhythm Music Spark</option>
                      <option value="Rocket">🚀 Hyper Space Rocket</option>
                      <option value="Heart">❤️ Passion Heart</option>
                      <option value="Moon">🌙 Crescent Moon Night</option>
                      <option value="TreePine">🌲 Christmas Pine Tree</option>
                      <option value="Flame">🔥 Burning Fire Lantern</option>
                      <option value="Droplets">💦 Splash Water Drops</option>
                      <option value="Smile">😊 Cheerful Smiling Face</option>
                      <option value="Fingerprint">☝️ Biometric Fingerprint</option>
                      <option value="custom_input">✍️ Write Custom Emoji / Text...</option>
                      <option value="custom_image">🖼️ Custom Image URL...</option>
                    </select>

                    {(() => {
                      const isPredefined = ["Sparkles", "Star", "Zap", "Coffee", "Gift", "Trophy", "Music", "Rocket", "Heart", "Moon", "TreePine", "Flame", "Droplets", "Smile", "Fingerprint"].includes(formThemeIcon);
                      const isImage = !isPredefined && (formThemeIcon.startsWith("http://") || formThemeIcon.startsWith("https://") || formThemeIcon.startsWith("data:image/") || formThemeIcon === "https://");
                      const isText = !isPredefined && !isImage;

                      if (isImage) {
                         return (
                           <div className="animate-in fade-in slide-in-from-top-1 duration-200 mt-2 space-y-1">
                             <input
                               type="text"
                               value={formThemeIcon}
                               onChange={(e) => setFormThemeIcon(e.target.value)}
                               className="w-full bg-indigo-50/50 dark:bg-slate-950/85 border border-indigo-200 dark:border-indigo-900 text-xs rounded-xl p-2.5 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-center"
                               placeholder="Enter Image URL..."
                             />
                           </div>
                         );
                      } else if (isText) {
                         return (
                           <div className="animate-in fade-in slide-in-from-top-1 duration-200 mt-2 space-y-1">
                             <input
                               type="text"
                               value={formThemeIcon}
                               onChange={(e) => setFormThemeIcon(e.target.value)}
                               className="w-full bg-indigo-50/50 dark:bg-slate-950/85 border border-indigo-200 dark:border-indigo-900 text-xs rounded-xl p-2.5 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-center"
                               placeholder="Type Emoji standard (🦖) or custom text"
                               maxLength={15}
                             />
                           </div>
                         );
                      }
                      return null;
                    })()}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Hover Micro-effect Style</label>
                    <select
                      value={formThemeInteractiveEffect}
                      onChange={(e) => setFormThemeInteractiveEffect(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white font-medium"
                    >
                      <option value="pulse">💓 Slow Pulsating Loop (Aura glow)</option>
                      <option value="bounce">🏀 Cheerful Bouncing Motion</option>
                      <option value="spin">🌀 Whirling Infinite Rotation </option>
                      <option value="none">🛑 Static Flat (Minimalist Clean)</option>
                    </select>
                  </div>
                </div>

                {/* Particle override */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Particle Emojis (Space-separated list)</label>
                  <input
                    type="text"
                    value={formThemeEmojis}
                    onChange={(e) => setFormThemeEmojis(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white font-medium text-center font-mono"
                    placeholder="e.g. ⭐ ✨ 🔮 🚀 🍭"
                  />
                  <p className="text-[10px] text-slate-400 block mt-1">
                    Type emojis separated by spaces which shoot out when checking in/out.
                  </p>
                </div>

                {/* Background Preset Gradients Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 font-medium">Fine Theme Presets Selection</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        name: "Galactic Purple",
                        gradient: "border-purple-355 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500",
                        ripple: "bg-indigo-500/20"
                      },
                      {
                        name: "Sunset Blaze",
                        gradient: "border-orange-355 bg-gradient-to-b from-orange-500 via-red-500 to-pink-600",
                        ripple: "bg-orange-500/20"
                      },
                      {
                        name: "Solar Gold",
                        gradient: "border-amber-355 bg-gradient-to-b from-yellow-405 via-amber-500 to-orange-600",
                        ripple: "bg-amber-500/20"
                      },
                      {
                        name: "Deep Ocean",
                        gradient: "border-[#104f55] bg-gradient-to-b from-[#0a1128] via-[#001f54] to-[#034078]",
                        ripple: "bg-blue-500/20"
                      },
                      {
                        name: "Emerald Forest",
                        gradient: "border-emerald-355 bg-gradient-to-b from-emerald-500 to-teal-700",
                        ripple: "bg-emerald-500/20"
                      },
                      {
                        name: "Tropical Aqua",
                        gradient: "border-cyan-211 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600",
                        ripple: "bg-cyan-500/20"
                      },
                      {
                        name: "Cyber Lime",
                        gradient: "border-lime-211 bg-gradient-to-b from-lime-400 to-emerald-600",
                        ripple: "bg-lime-500/20"
                      },
                      {
                        name: "Strawberry Shake",
                        gradient: "border-pink-211 bg-gradient-to-b from-pink-400 to-rose-500",
                        ripple: "bg-pink-500/20"
                      }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormThemeBaseColor(preset.gradient);
                          setFormThemeRippleColor(preset.ripple);
                        }}
                        className={`text-[9px] font-black uppercase p-2 border rounded-lg transition-transform hover:scale-105 text-left ${
                          formThemeBaseColor === preset.gradient 
                            ? "border-slate-800 dark:border-white ring-2 ring-indigo-500 text-indigo-700 dark:text-white" 
                            : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"
                        }`}
                      >
                        <div className={`h-3 w-full rounded mb-1 ${preset.gradient}`} />
                        <p className="truncate text-[8px] text-center">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom CSS overrides input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Tailwind Gradient Classes (Fine Code override)</label>
                    <input
                      type="text"
                      value={formThemeBaseColor}
                      onChange={(e) => setFormThemeBaseColor(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-[10px] rounded-xl p-2.5 font-mono text-slate-700 dark:text-slate-300"
                      placeholder="e.g. border-teal-200 bg-gradient-to-l from-teal-400 to-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Pulse Ripple Classes (Fine Code override)</label>
                    <input
                      type="text"
                      value={formThemeRippleColor}
                      onChange={(e) => setFormThemeRippleColor(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-[10px] rounded-xl p-2.5 font-mono text-slate-700 dark:text-slate-300"
                      placeholder="e.g. bg-teal-500/20"
                    />
                  </div>
                </div>

                {/* Submit Action Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-1">
                  {editingThemeId && (
                    <button
                      type="button"
                      onClick={resetThemeForm}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCreateOrUpdateTheme}
                    className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 active:scale-95 text-xs font-extrabold text-white rounded-xl transform transition-all flex items-center shadow-md shadow-indigo-600/20 bg-indigo-600"
                  >
                    {editingThemeId ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Save Themes Changes
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Create & Store Theme
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transitions & Particles Customization Card */}
          {activeTab === 'particles' && localSettings.animationsEnabled && (
            <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 animate-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">Transitions & Particles Tuning</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Particle Count */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Particle Count</label>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">{localSettings.particleCount ?? 60}</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={localSettings.particleCount ?? 60}
                    onChange={(e) => handleUpdateLocalSettings({ particleCount: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <span className="text-[9px] text-slate-400 block mt-0.5">Control emission density on status toggles</span>
                </div>

                {/* Particle Direction / Style */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Animation Flow Direction</label>
                  <select 
                    value={localSettings.particleDirection ?? "default"}
                    onChange={(e) => handleUpdateLocalSettings({ particleDirection: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 font-medium focus:outline-none dark:text-white"
                  >
                    <option value="default">Default (Theme-specific)</option>
                    <option value="falling">Falling (Downwards Rain)</option>
                    <option value="rising">Rising (Upwards Float)</option>
                    <option value="explode">Explosion (Center Sparkle)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Min speed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Particle Min Lifetime (s)</label>
                  <input 
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={localSettings.particleMinSpeed ?? 2}
                    onChange={(e) => handleUpdateLocalSettings({ particleMinSpeed: parseFloat(e.target.value) || 2 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 dark:text-white font-mono font-bold"
                  />
                </div>

                {/* Max speed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Particle Max Lifetime (s)</label>
                  <input 
                    type="number"
                    min="0.5"
                    max="15"
                    step="0.5"
                    value={localSettings.particleMaxSpeed ?? 5}
                    onChange={(e) => handleUpdateLocalSettings({ particleMaxSpeed: parseFloat(e.target.value) || 5 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Ripple Pulse speed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Ripple Pulse Speed (s)</label>
                  <input 
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={localSettings.ripplePulseDuration ?? 3}
                    onChange={(e) => handleUpdateLocalSettings({ ripplePulseDuration: parseFloat(e.target.value) || 3 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 dark:text-white font-mono font-bold"
                  />
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-sans">Circular halo pulsing interval</span>
                </div>

                {/* Button scale hover magnitude zoom */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Button Hover Scale</label>
                  <select 
                    value={localSettings.buttonHoverZoom ?? 1.03}
                    onChange={(e) => handleUpdateLocalSettings({ buttonHoverZoom: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 font-mono font-bold dark:text-white cursor-pointer"
                  >
                    <option value="1">1.00 (No Zoom)</option>
                    <option value="1.01">1.01 (Subtle Zoom)</option>
                    <option value="1.03">1.03 (Standard Zoom)</option>
                    <option value="1.05">1.05 (Magnified Zoom)</option>
                    <option value="1.1">1.10 (Intense Zoom)</option>
                  </select>
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-sans">Scale multiplier on mouse hover</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Spin rotational speed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Particle Continuous Spin</label>
                  <select 
                    value={localSettings.particleSpinSpeed ?? "medium"}
                    onChange={(e) => handleUpdateLocalSettings({ particleSpinSpeed: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 font-mono font-bold dark:text-white cursor-pointer"
                  >
                    <option value="none">🛑 Static (No rotation)</option>
                    <option value="slow">🐢 Slow Rotation</option>
                    <option value="medium">⚡ Medium Rotation</option>
                    <option value="fast">🚀 High-Speed Spin</option>
                    <option value="random">🌀 Random Chaos</option>
                  </select>
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-sans">Spinning intensity during emission</span>
                </div>

                {/* Particle Dissolve/Fade Style */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Particle Dissolve Style</label>
                  <select 
                    value={localSettings.particleFadeMode ?? "both"}
                    onChange={(e) => handleUpdateLocalSettings({ particleFadeMode: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 font-mono font-bold dark:text-white cursor-pointer"
                  >
                    <option value="fade">🌪️ Opacity Fade Out Only</option>
                    <option value="scale">🎈 Scale Down Out Only</option>
                    <option value="both">✨ Both Fade & Scale Down</option>
                    <option value="none">🛑 Sudden Pop Off (None)</option>
                  </select>
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-sans">Dispersal transition effect</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Min Particle scale size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Min Particle Scale</label>
                  <input 
                    type="number"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={localSettings.particleScaleMin ?? 0.5}
                    onChange={(e) => handleUpdateLocalSettings({ particleScaleMin: parseFloat(e.target.value) || 0.5 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 dark:text-white font-mono font-bold"
                  />
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-sans">Smallest particle scale multiplier</span>
                </div>

                {/* Max Particle scale size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Max Particle Scale</label>
                  <input 
                    type="number"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={localSettings.particleScaleMax ?? 1.5}
                    onChange={(e) => handleUpdateLocalSettings({ particleScaleMax: parseFloat(e.target.value) || 1.5 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 dark:text-white font-mono font-bold"
                  />
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-sans">Largest particle scale multiplier</span>
                </div>
              </div>

              <div className="pt-2">
                {/* Pulse Ripple Halo Glow Color override */}
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 font-medium">Concentric Action Pulse Halo Glow Color</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: "theme", name: "Theme Default", color: "bg-slate-250 dark:bg-slate-850 border border-slate-350 dark:border-slate-700" },
                    { id: "indigo", name: "Royal Purple", color: "bg-indigo-500" },
                    { id: "emerald", name: "Forest Mint", color: "bg-emerald-500" },
                    { id: "amber", name: "Summer Gold", color: "bg-amber-500" },
                    { id: "pink", name: "Neon Pink", color: "bg-pink-500" },
                    { id: "rose", name: "Blaze Red", color: "bg-rose-500" },
                    { id: "blue", name: "Sky Blue", color: "bg-blue-500" },
                    { id: "purple", name: "Plum Purple", color: "bg-purple-500" },
                    { id: "cyan", name: "Synth Cyan", color: "bg-cyan-400" },
                    { id: "gold", name: "True Gold", color: "bg-yellow-350 border border-yellow-500" },
                    { id: "rainbow", name: "Rainbow", color: "bg-gradient-to-r from-red-400 via-green-400 via-blue-400 to-pink-400" }
                  ].map((colorObj) => (
                    <button
                      key={colorObj.id}
                      type="button"
                      onClick={() => handleUpdateLocalSettings({ rippleGlowColor: colorObj.id })}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[8px] font-black uppercase transition-all hover:scale-105 ${
                        (localSettings.rippleGlowColor || "theme") === colorObj.id
                          ? "border-slate-800 dark:border-white ring-2 ring-indigo-500 text-indigo-700 dark:text-white"
                          : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className={`h-2.5 w-6 rounded-full mb-1 ${colorObj.color}`} />
                      {colorObj.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Night Theme Conditions */}
          {activeTab === 'night' && (
          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">Auto Night & Lunar Theme</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.moonThemeEnabled} 
                  onChange={(e) => handleUpdateLocalSettings({ moonThemeEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>

            {localSettings.moonThemeEnabled && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Night Theme Start Hour</label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 block">Night event automatically commences</span>
                  </div>
                  <input 
                    type="time" 
                    value={localSettings.moonThemeStartTime || "19:00"}
                    onChange={(e) => handleUpdateLocalSettings({ moonThemeStartTime: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg p-2 dark:text-white cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Night Theme Override</label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 block">Select a custom theme for night</span>
                  </div>
                  <select
                    value={localSettings.moonThemeOverrideId || "default"}
                    onChange={(e) => handleUpdateLocalSettings({ moonThemeOverrideId: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg p-2 dark:text-white cursor-pointer"
                  >
                    <option value="default">Default Lunar Theme</option>
                    {localSettings.customThemes?.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Simulation block */}
                <div className="flex flex-col space-y-3 p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-350">Simulate Custom Date</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-90">
                      <input 
                        type="checkbox" 
                        checked={localSettings.moonCustomDateEnabled || false} 
                        onChange={(e) => handleUpdateLocalSettings({ moonCustomDateEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                    </label>
                  </div>
                  
                  {localSettings.moonCustomDateEnabled && (
                    <div className="space-y-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/85 shadow-sm">
                      {/* Interactive Calendar Control Grid */}
                      <div className="space-y-3">
                        {/* Header with Month / Year selectors plus quick Month increment/decrement arrows */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            {/* Month Dropdown */}
                            <select
                              value={viewMonth}
                              onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-100 cursor-pointer outline-none hover:border-indigo-400 dark:hover:border-indigo-500 transition"
                            >
                              {MONTHS_LABELS.map((label, idx) => (
                                <option key={idx} value={idx + 1} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-semibold">
                                  {label}
                                </option>
                              ))}
                            </select>

                            {/* Year Dropdown */}
                            <select
                              value={viewYear}
                              onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg px-1.5 py-1.5 text-slate-800 dark:text-slate-100 cursor-pointer outline-none hover:border-indigo-400 dark:hover:border-indigo-500 transition"
                            >
                              {Array.from({ length: 15 }, (_, i) => 2020 + i).map((yr) => (
                                <option key={yr} value={yr} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-semibold">
                                  {yr}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center space-x-1">
                            {/* Previous Month Arrow */}
                            <button
                              type="button"
                              onClick={() => {
                                let m = viewMonth - 1;
                                let y = viewYear;
                                if (m === 0) {
                                  m = 12;
                                  y -= 1;
                                }
                                setViewMonth(m);
                                setViewYear(y);
                              }}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition"
                              title="Previous Month"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Back to Real Today Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const now = new Date();
                                const yStr = String(now.getFullYear());
                                const mStr = String(now.getMonth() + 1).padStart(2, "0");
                                const dStr = String(now.getDate()).padStart(2, "0");
                                handleUpdateLocalSettings({ moonCustomDate: `${yStr}-${mStr}-${dStr}` });
                              }}
                              className="text-[10px] font-bold px-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 rounded-lg transition"
                            >
                              Today
                            </button>

                            {/* Next Month Arrow */}
                            <button
                              type="button"
                              onClick={() => {
                                let m = viewMonth + 1;
                                let y = viewYear;
                                if (m === 13) {
                                  m = 1;
                                  y += 1;
                                }
                                setViewMonth(m);
                                setViewYear(y);
                              }}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition"
                              title="Next Month"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Weekday lists & Months Grid Canvas */}
                        <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl p-2.5 bg-slate-50/50 dark:bg-slate-950/20">
                          {/* Week Labels Panel */}
                          <div className="grid grid-cols-7 text-center gap-y-1 mb-2">
                            {DAYS_OF_WEEK.map((dayLabel, idx) => (
                              <span key={idx} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                {dayLabel}
                              </span>
                            ))}
                          </div>

                          {/* 42-Cells Monthly Grid Calendar */}
                          <div className="grid grid-cols-7 text-center gap-1.5">
                            {getCalendarCells().map((cell, idx) => {
                              // Match selected custom dates
                              const [simY, simM, simD] = (localSettings.moonCustomDate || "2026-06-19").split("-").map(Number);
                              const isSelected = cell.isCurrentMonth && cell.year === simY && cell.month === simM && cell.day === simD;
                              
                              const moonSym = getMoonSymbolForCell(cell.year, cell.month, cell.day);
                              const isFullMoon = moonSym === "🌕";

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleCellClick(cell.year, cell.month, cell.day)}
                                  className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-semibold select-none transition-all ${
                                    cell.isCurrentMonth
                                      ? isSelected
                                        ? "bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30 scale-105 z-10"
                                        : isFullMoon
                                          ? "bg-amber-400/10 hover:bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-300/30 font-bold"
                                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-250/65 dark:hover:bg-slate-805"
                                      : isSelected
                                        ? "bg-indigo-650/50 text-white/90 scale-105"
                                        : "text-slate-300 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                                  }`}
                                  title={`${cell.day} ${MONTHS_LABELS[cell.month - 1]} ${cell.year} (${getMoonPhaseNameForCell(cell.year, cell.month, cell.day)})`}
                                >
                                  {/* Day text indicator */}
                                  <span className="text-[11px] leading-none mb-1">{cell.day}</span>
                                  
                                  {/* Micro Indicator phase row */}
                                  <div className="absolute bottom-[2px] flex items-center justify-center">
                                    {moonSym ? (
                                      <span className={`text-[8.5px] leading-none ${isFullMoon ? "text-amber-400 animate-pulse font-bold" : "text-slate-400"}`}>
                                        {moonSym}
                                      </span>
                                    ) : (
                                      (() => {
                                        const today = new Date();
                                        const isToday = cell.day === today.getDate() && cell.month === (today.getMonth() + 1) && cell.year === today.getFullYear();
                                        return isToday && !isSelected ? (
                                          <div className="w-1 h-1 rounded-full bg-indigo-505 bg-indigo-500 animate-ping" />
                                        ) : null;
                                      })()
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Explicit DD/MM/YYYY dropdowns below the interactive grid */}
                      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-105 dark:border-slate-800/80">
                        <div>
                          <label className="block text-[9px] text-slate-400 dark:text-slate-500 mb-1 font-bold">DAY (DD)</label>
                          <select
                            value={(() => {
                              const parts = (localSettings.moonCustomDate || "2026-06-19").split("-");
                              return parts[2] || "19";
                            })()}
                            onChange={(e) => {
                              const parts = (localSettings.moonCustomDate || "2026-06-19").split("-");
                              const newDay = e.target.value.padStart(2, "0");
                              const newDate = `${parts[0] || "2026"}-${parts[1] || "06"}-${newDay}`;
                              handleUpdateLocalSettings({ moonCustomDate: newDate });
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 text-[11px] font-bold rounded p-1 text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                          >
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((d) => (
                              <option key={d} value={d} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-semibold">
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-400 dark:text-slate-500 mb-1 font-bold">MONTH (MM)</label>
                          <select
                            value={(() => {
                              const parts = (localSettings.moonCustomDate || "2026-06-19").split("-");
                              return parts[1] || "06";
                            })()}
                            onChange={(e) => {
                              const parts = (localSettings.moonCustomDate || "2026-06-19").split("-");
                              const newMonth = e.target.value.padStart(2, "0");
                              const newDate = `${parts[0] || "2026"}-${newMonth}-${parts[2] || "19"}`;
                              handleUpdateLocalSettings({ moonCustomDate: newDate });
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 text-[11px] font-bold rounded p-1 text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                          >
                            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                              <option key={m} value={m} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-semibold">
                                {m} - {MONTHS_LABELS[parseInt(m, 10) - 1].slice(0, 3)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-400 dark:text-slate-500 mb-1 font-bold">YEAR (YYYY)</label>
                          <select
                            value={(() => {
                              const parts = (localSettings.moonCustomDate || "2026-06-19").split("-");
                              return parts[0] || "2026";
                            })()}
                            onChange={(e) => {
                              const parts = (localSettings.moonCustomDate || "2026-06-19").split("-");
                              const newYear = e.target.value;
                              const newDate = `${newYear}-${parts[1] || "06"}-${parts[2] || "19"}`;
                              handleUpdateLocalSettings({ moonCustomDate: newDate });
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 text-[11px] font-bold rounded p-1 text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                          >
                            {Array.from({ length: 10 }, (_, i) => String(2023 + i)).map((y) => (
                              <option key={y} value={y} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-semibold">
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Display Lunar phase metadata info card */}
                      {localSettings.moonCustomDate && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-center bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-dashed border-indigo-200/50 dark:border-slate-800">
                          <div className="text-left font-mono">
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block uppercase tracking-wider">
                              Target Custom Date:
                            </span>
                            <span className="text-xs text-slate-700 dark:text-slate-350 font-bold">
                              {(() => {
                                const parts = localSettings.moonCustomDate.split("-");
                                if (parts.length === 3) {
                                  return `DD/MM/YYYY → ${parts[2]} / ${parts[1]} / ${parts[0]}`;
                                }
                                return localSettings.moonCustomDate;
                              })()}
                            </span>
                          </div>

                          <div className="text-right sm:text-right">
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block uppercase tracking-wider">
                              Calculated Lunar Phase:
                            </span>
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-end gap-1">
                              {(() => {
                                const parts = localSettings.moonCustomDate.split("-").map(Number);
                                if (parts.length === 3) {
                                  return getMoonPhaseNameForCell(parts[0], parts[1], parts[2]);
                                }
                                return "Unknown";
                              })()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Custom Lunar Phase Images & Descriptions */}
                <div className="flex flex-col space-y-3 p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                     <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                     <span className="text-xs font-bold text-slate-600 dark:text-slate-350">Customize Lunar Phases</span>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                     {[
                        "🌑 New Moon",
                        "🌒 Waxing Crescent",
                        "🌓 First Quarter",
                        "🌔 Waxing Gibbous",
                        "🌕 Full Moon",
                        "🌖 Waning Gibbous",
                        "🌗 Third Quarter",
                        "🌘 Waning Crescent"
                     ].map(phase => {
                        const phaseData = localSettings.moonCustomPhases?.[phase] || { image: "", description: "" };
                        return (
                          <div key={phase} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-2">
                             <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{phase}</div>
                             <input 
                               type="text"
                               placeholder="Image URL..."
                               value={phaseData.image || ""}
                               onChange={e => handleUpdateLocalSettings({
                                 moonCustomPhases: {
                                    ...(localSettings.moonCustomPhases || {}),
                                    [phase]: { ...phaseData, image: e.target.value }
                                 }
                               })}
                               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] rounded-md p-2 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
                             />
                             <input 
                               type="text"
                               placeholder="Custom Description..."
                               value={phaseData.description || ""}
                               onChange={e => handleUpdateLocalSettings({
                                 moonCustomPhases: {
                                    ...(localSettings.moonCustomPhases || {}),
                                    [phase]: { ...phaseData, description: e.target.value }
                                 }
                               })}
                               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] rounded-md p-2 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
                             />
                             <select
                               value={phaseData.customThemeId || "default"}
                               onChange={e => handleUpdateLocalSettings({
                                 moonCustomPhases: {
                                    ...(localSettings.moonCustomPhases || {}),
                                    [phase]: { ...phaseData, customThemeId: e.target.value }
                                 }
                               })}
                               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold rounded-md p-2 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer"
                             >
                                <option value="default">🌐 Follow Global Night Setting</option>
                                <option value="moon">🌙 Original Moon Theme</option>
                                {localSettings.customThemes?.map(t => (
                                  <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                             </select>
                             <input 
                               type="text"
                               placeholder="Particle Emojis (Space-separated list)..."
                               value={phaseData.particleEmojis || ""}
                               onChange={e => handleUpdateLocalSettings({
                                 moonCustomPhases: {
                                    ...(localSettings.moonCustomPhases || {}),
                                    [phase]: { ...phaseData, particleEmojis: e.target.value }
                                 }
                               })}
                               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] rounded-md p-2 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
                             />
                          </div>
                        );
                     })}
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Background settings card */}
          {activeTab === 'backgrounds' && (
          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                  Background Button Images
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.showBackgroundImages !== false} 
                  onChange={(e) => handleUpdateLocalSettings({ showBackgroundImages: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>

            {localSettings.showBackgroundImages !== false && (
              <div className="space-y-4 pt-1">
                
                {/* Speed configuration */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-350">
                      Slideshow Auto-Slide Speed
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                      {localImageTransitionSpeed}s interval
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="3" 
                    max="30" 
                    step="1" 
                    value={localImageTransitionSpeed} 
                    onChange={(e) => setLocalImageTransitionSpeed(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-[9px] text-slate-400 block">Slider adjusts auto-rotation timing when 2 or more images exist.</span>
                </div>

                {/* Upload Section */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-450 block">Upload & Add Background Custom Image URL</span>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="Paste Unsplash or static image URL..." 
                      value={newImgUrl} 
                      onChange={(e) => setNewImgUrl(e.target.value)}
                      className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button 
                      type="button"
                      onClick={handleAddImage}
                      className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-xs font-bold flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  {errorMessage && <p className="text-[10px] text-rose-500 font-bold">{errorMessage}</p>}
                </div>

                {/* Preset templates */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Click preset templates to add instantly:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {presetTemplates.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!localImages.includes(preset)) {
                            setLocalImages(prev => [...prev, preset]);
                          }
                          setErrorMessage("");
                        }}
                        className="relative rounded-lg overflow-hidden h-16 border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all"
                        title="Add preset background"
                      >
                        <img src={preset} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/10 hover:bg-black/0 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white drop-shadow" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image List Gallery */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-450 block">
                    Active Slide Images ({localImages.length})
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {localImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden h-24 bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                        <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        
                        {/* Remove Hover Layer */}
                        <button 
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          disabled={localImages.length <= 1}
                          className="absolute inset-0 bg-rose-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-150 text-white disabled:pointer-events-none disabled:bg-slate-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {localImages.length < 2 && (
                    <p className="text-[10px] text-indigo-500 font-semibold italic bg-indigo-50/50 dark:bg-indigo-950/20 p-2 rounded">
                      Add 2 or more images above for them to auto-slide inside the push button!
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
          )}

          </div>
        </div>

        {/* Footer - Symmetrically clean */}
        <div className="px-6 py-4 shrink-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
          {!confirmClear ? (
             <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40 text-xs font-bold rounded-xl transition-all outline-none border border-rose-100 dark:border-rose-900/50"
            >
              Clear App Data
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-rose-500 font-bold hidden sm:inline">Are you sure?</span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("smart-attendance-storage");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold rounded-xl transition-all outline-none border border-rose-700"
              >
                Yes, Clear All
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition-all outline-none"
              >
                Cancel
              </button>
            </div>
          )}
          <button 
            type="button"
            onClick={handleApplySettings}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold tracking-wider uppercase rounded-xl shadow-lg shadow-indigo-600/15 transition-all outline-none"
          >
            Apply Settings
          </button>
        </div>

      </div>
    </div>
  );
}
