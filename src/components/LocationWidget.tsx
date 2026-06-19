import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { MapPin, RefreshCw } from "lucide-react";

export default function LocationWidget() {
  const { settings } = useStore();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (!settings.showLocation) return;
    setLoading(true);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [settings.showLocation]);

  if (!settings.showLocation) return null;

  const mapApiKey = "AIzaSyDkQ9LudeolipNJ3X4acWGftlDACtnTJSU";

  return (
    <div className="flex flex-col space-y-3 mb-8">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Current Location</p>
        <button 
          onClick={fetchLocation}
          className="p-1 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
          title="Refresh Location"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <div className="text-sm text-red-400 font-medium">{error}</div>}
      
      {location && (
        <>
          <div className="w-full h-24 bg-slate-800 rounded-xl relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent z-10 pointer-events-none"></div>
            <img 
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=400x200&maptype=roadmap&markers=color:0x6366f1%7C${location.lat},${location.lng}&style=feature:all|element:labels.text.fill|color:0x9ca3af&style=feature:all|element:labels.text.stroke|color:0x111827&style=feature:water|element:geometry|color:0x111827&style=feature:landscape|element:geometry|color:0x1f2937&style=feature:road|element:geometry|color:0x374151&style=feature:poi|element:geometry|color:0x1f2937&key=${mapApiKey}`}
              alt="Map"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[9px] font-mono z-20 text-indigo-300">
              {location.lat.toFixed(3)}° N, {location.lng.toFixed(3)}° E
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold truncate text-slate-200">Office Branch: HQ</p>
            <p className="text-xs text-emerald-400 mt-1">12m from office • Accurate (~5m)</p>
          </div>
        </>
      )}
      {!location && !loading && !error && (
        <div className="text-sm text-slate-500 italic">Location not determined.</div>
      )}
    </div>
  );
}
