import { useStore } from "../store/useStore";
import { format } from "date-fns";

export default function AttendanceHistory() {
  const { records } = useStore();

  if (records.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden max-h-[300px] overflow-y-auto mb-8">
      <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-6">Recent Timeline</p>
      
      <div className="space-y-6 relative ml-1">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

        {records.slice(0, 5).map((record) => (
          <div key={record.id} className="relative pl-8 flex flex-col">
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[#0a0a0c] z-10 ${
              record.type === "in" ? "bg-emerald-500" : "bg-indigo-400"
            }`}></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">
              {format(new Date(record.timestamp), "hh:mm a")}
            </span>
            <span className="text-sm font-semibold text-slate-100">
              {record.type === "in" ? "Checked In" : "Checked Out"}
            </span>
            {record.type === "out" && record.hoursSoFar && (
              <span className="text-[10px] text-indigo-300 italic mt-1">Worked {record.hoursSoFar}h</span>
            )}
          </div>
        ))}
        {records.length === 0 && (
          <div className="relative pl-8 flex flex-col opacity-50">
             <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-700 border-4 border-[#0a0a0c] z-10"></div>
             <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">--:-- PM</span>
             <span className="text-sm font-semibold text-slate-300">Expected Checkout</span>
             <span className="text-[10px] text-slate-500 italic mt-0.5">Calculating...</span>
          </div>
        )}
      </div>
    </div>
  );
}
