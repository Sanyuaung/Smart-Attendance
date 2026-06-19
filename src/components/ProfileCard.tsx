import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";

export default function ProfileCard() {
  const { user, status } = useStore();

  const statusColor = {
    "Checked In": "bg-green-500",
    "Checked Out": "bg-slate-400",
    "Late": "bg-amber-500",
    "Absent": "bg-red-500"
  }[status];

  return (
    <div className="flex flex-col mb-8">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/50 p-0.5">
          <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-200">{user.name}</h2>
          <p className="text-xs text-indigo-300/70">{user.department}</p>
        </div>
      </div>

      <p className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-3">Current Shift</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xl font-bold text-slate-100">{user.shiftStart} - {user.shiftEnd}</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter",
          status === "Checked In" || status === "Late" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
          "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
        )}>
          {status}
        </div>
      </div>
    </div>
  );
}
