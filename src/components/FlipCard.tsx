import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, X } from "lucide-react";

interface FlipCardProps {
  id: string;
  isFlipped: boolean;
  onFlip: (id: string, flipped: boolean) => void;
  title: string;
  info?: {
    explanation: string;
    calculation: string;
    targetFor: string;
    purpose: string;
    howToDo: string;
  };
  frontContent: React.ReactNode;
  containerClassName?: string;
  frontClassName?: string;
}

export default function FlipCard({
  id,
  isFlipped,
  onFlip,
  title,
  info,
  frontContent,
  containerClassName = "",
  frontClassName = ""
}: FlipCardProps) {
  return (
    <motion.div
      className={`w-full h-full relative ${containerClassName}`}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* FRONT FACE */}
      <div 
        className={`${frontClassName} ${isFlipped ? 'pointer-events-none' : ''}`}
        style={{ backfaceVisibility: "hidden" }}
      >
        {frontContent}
      </div>

      {/* BACK FACE */}
      <div 
        className={`absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/10 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full overflow-y-auto ${!isFlipped ? 'pointer-events-none' : ''}`}
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
              {title} Info
            </h3>
          </div>
          <button 
            onClick={() => onFlip(id, false)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
            title="Close Info"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {info ? (
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Explanation</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {info.explanation}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Calculation</h4>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg p-2">
                <code className="text-[10px] text-slate-700 dark:text-slate-300 font-mono">
                  {info.calculation}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Target For</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  {info.targetFor}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Purpose</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  {info.purpose}
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Actionable Insight</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {info.howToDo}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
            <Eye className="w-8 h-8 mb-2 opacity-20" />
            No info available.
          </div>
        )}
      </div>
    </motion.div>
  );
}
