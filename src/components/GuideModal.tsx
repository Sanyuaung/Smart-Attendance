import React from "react";
import { X, BookOpen, Settings, Moon, Image as ImageIcon, Sparkles, Smartphone, ShieldCheck, HelpCircle, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">App Guide & Manual</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Everything you need to know about Smart Attendance</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                id="close-guide-btn"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-12">
              
              {/* Introduction */}
              <section className="space-y-3 relative">
                <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                   <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Mastering Smart Attendance</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Smart Attendance is not just a tracker—it's a fully programmable biometric dashboard. Follow this guide to unlock its advanced visual engines and automated workflows.
                </p>
              </section>

              {/* 1. General Settings */}
              <section className="space-y-5">
                <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-200">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">General Configuration</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Core System Controls</p>
                  </div>
                </div>
                <div className="pl-12 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center">
                        <Smartphone className="w-3 h-3 mr-1.5 text-blue-500" /> Appearance Modes
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Sync with your OS or force <strong>pure light/dark</strong> environments.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center">
                        <Smartphone className="w-3 h-3 mr-1.5 text-blue-500" /> Biometric Branding
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Change "CHECK IN" to any custom call-to-action for your dashboard.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Widgets & Telemetry</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      Toggle the visibility of real-time <strong>Weather</strong> and <strong>Location</strong> data widgets in the dashboard footer.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Custom Themes Engine */}
              <section className="space-y-5">
                <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-200">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Theme Architect Engine</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Visual Identity Builder</p>
                  </div>
                </div>
                <div className="pl-12 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Slot-Based Architecture</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Design and save multiple "Custom Themes". Each slot includes a unique <strong>Geographic Shape</strong> (Circle, Squircle, etc.) and color identity.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-purple-500 mb-1">Fingerprint Override</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Replace the biometric icon with <strong>Custom Emojis</strong>, <strong>Lucide Icons</strong>, or <strong>Remote Image URLs</strong>.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-purple-500 mb-1">Interactive Effects</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Assign <strong>Spin</strong>, <strong>Bounce</strong>, or <strong>Pulse</strong> animations that trigger on hover.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Auto Night & Lunar Engine */}
              <section className="space-y-5">
                <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-200">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <Moon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Auto Night & Lunar Tracking</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Temporal & Astronomical Automation</p>
                  </div>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    The app calculates precise Moon phases based on your local date. You can automate visual transitions using these states:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                       <div className="mt-1 w-1 h-1 rounded-full bg-indigo-500" />
                       <p className="text-[11px] text-slate-600 dark:text-slate-400"><strong>Night Overrides:</strong> Set a specific theme to activate automatically at your defined "Night Start Time".</p>
                    </li>
                    <li className="flex items-start space-x-3">
                       <div className="mt-1 w-1 h-1 rounded-full bg-indigo-500" />
                       <p className="text-[11px] text-slate-600 dark:text-slate-400"><strong>Phase-Specific Mapping:</strong> Assign unique <strong>Images</strong>, <strong>Descriptions</strong>, and <strong>Custom Themes</strong> for each of the 8 Lunar Phases individually.</p>
                    </li>
                    <li className="flex items-start space-x-3">
                       <div className="mt-1 w-1 h-1 rounded-full bg-indigo-500" />
                       <p className="text-[11px] text-slate-600 dark:text-slate-400"><strong>Interactive Simulation:</strong> Use the <strong>Lunar Grid Calendar</strong> to click any date and instantly preview themes and phases for that specific time.</p>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 4. Particles & Effects */}
              <section className="space-y-5">
                <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-200">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                    <Sliders className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Particles & Micro-physics</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Haptic & Kinetic Tuning</p>
                  </div>
                </div>
                <div className="pl-12 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Kinetic Flow</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Control <strong>Density (Count)</strong>, <strong>Direction (Falling/Rising/Explode)</strong>, and <strong>Lifetime</strong> of check-in particles.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Action Pulse Halo</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Customize the <strong>Concentric Pulse Color</strong> (Rainbow, Gold, Synth Cyan, etc.) surrounding the main button.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Background Images */}
              <section className="space-y-5">
                <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-200">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Dynamic Background Management</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Atmospheric Visual Layer</p>
                  </div>
                </div>
                <div className="pl-12 space-y-3">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Personalize your dashboard with high-resolution imagery.
                  </p>
                  <ul className="space-y-2 list-disc pl-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <li><strong>Unsplash Keywords:</strong> Type <code>$minimal</code> or <code>$abstract</code> to pull high-quality dynamic photos.</li>
                    <li><strong>Velocity Control:</strong> Adjust rotation speed from <strong>Instant</strong> to <strong>Slow (2-minute cycles)</strong> transitions.</li>
                  </ul>
                </div>
              </section>

              {/* Maintenance */}
              <section className="p-5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Maintenance & Safety</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                    <strong>Clear App Data:</strong> Located in the Settings footer. Use this to factory reset the application if local storage becomes corrupted or if you want to wipe all custom themes and history.
                  </p>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                    <strong>Manual Persistence:</strong> Ensure you click <strong>"Apply Settings"</strong> in the modal footer to commit your local configuration changes to the browser's database.
                  </p>
                </div>
              </section>

            </div>


            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
