import { useStore } from "../store/useStore";
import { Clock, CalendarCheck, AlertTriangle, CalendarDays } from "lucide-react";

export default function AttendanceSummary() {
  const { status } = useStore();

  // Mock data for summary
  const summary = [
    { label: "Today's Hours", value: status === "Checked In" ? "4h 30m" : "0h 0m", icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Monthly Attd.", value: "94%", icon: CalendarCheck, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
    { label: "Late Count", value: "2", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Overtime", value: "12h", icon: CalendarDays, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  ];

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col">
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">Daily Summary</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-300">Working Hours</span>
          <span className="text-lg font-mono font-bold text-slate-100">{summary[0].value}</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
          <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: status === "Checked In" ? '45%' : '0%' }}></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Late Count</p>
          <p className="text-2xl font-bold text-slate-100">{summary[2].value}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">OT Hours</p>
          <p className="text-2xl font-bold text-indigo-400">{summary[3].value}</p>
        </div>
      </div>
    </div>
  );
}
