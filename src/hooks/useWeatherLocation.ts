import { useState, useEffect } from 'react';

export function useWeatherLocation() {
  const [weatherStr, setWeatherStr] = useState<string>("Loading weather...");
  const [isDay, setIsDay] = useState<boolean>(true);
  const [conditionStr, setConditionStr] = useState<string>("Clear");

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeatherStr("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        // Fetch weather
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code`);
        const data = await res.json();
        
        let condition = "Clear";
        const code = data.current.weather_code;
        if (code >= 1 && code <= 3) condition = "Partly Cloudy";
        if (code >= 45 && code <= 48) condition = "Foggy";
        if (code >= 51 && code <= 67) condition = "Rainy";
        if (code >= 71 && code <= 77) condition = "Snowy";
        if (code >= 95) condition = "Stormy";

        setConditionStr(condition);

        // Fetch location name
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const geoData = await geoRes.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state || "Unknown Location";
        
        setWeatherStr(`${data.current.temperature_2m}°C ${city}, ${condition}`);
        setIsDay(data.current.is_day === 1);
      } catch (err) {
        setWeatherStr(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
      }
    }, () => {
      setWeatherStr("Location access denied");
    });
  }, []);

  return { weatherStr, isDay, condition: conditionStr };
}
