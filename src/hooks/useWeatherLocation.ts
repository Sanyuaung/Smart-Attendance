import { useState, useEffect } from 'react';

export function useWeatherLocation() {
  const [weatherStr, setWeatherStr] = useState<string>("Loading weather...");
  const [isDay, setIsDay] = useState<boolean>(true);
  const [conditionStr, setConditionStr] = useState<string>("Clear");
  const [temp, setTemp] = useState<number | null>(null);
  const [city, setCity] = useState<string>("");
  const [precip, setPrecip] = useState<number>(0);

  useEffect(() => {
    const fetchWeatherForCoords = async (latitude: number, longitude: number, cityLabel?: string) => {
      try {
        // Fetch weather
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code,precipitation`);
        const data = await res.json();
        
        if (!data || !data.current) {
          throw new Error("No current weather data in response");
        }
        
        let condition = "Clear";
        const code = data.current.weather_code;
        if (code >= 1 && code <= 3) condition = "Partly Cloudy";
        if (code >= 45 && code <= 48) condition = "Foggy";
        if (code >= 51 && code <= 67) condition = "Rainy";
        if (code >= 71 && code <= 77) condition = "Snowy";
        if (code >= 95) condition = "Stormy";

        setConditionStr(condition);
        setIsDay(data.current.is_day === 1);
        setTemp(data.current.temperature_2m);
        setPrecip(data.current.precipitation || 0);

        let finalCity = cityLabel || "";
        if (!finalCity) {
          try {
            // High reliability BigDataCloud Geocoding client
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              finalCity = geoData?.city || geoData?.locality || geoData?.principalSubdivision || "";
            }
          } catch (e) {
            console.warn("BigDataCloud failed, trying Nominatim...", e);
          }
        }

        if (!finalCity) {
          try {
            // Fallback to nominatim with a proper User-Agent
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
              headers: {
                "User-Agent": "SmartAttendanceTracker/1.0"
              }
            });
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              finalCity = geoData?.address?.city || geoData?.address?.town || geoData?.address?.village || geoData?.address?.county || geoData?.address?.state || "";
            }
          } catch (e) {
            console.warn("Nominatim fallback failed", e);
          }
        }

        if (!finalCity) {
          finalCity = `${latitude.toFixed(1)}°N, ${longitude.toFixed(1)}°E`;
        }

        setCity(finalCity);
        setWeatherStr(`${data.current.temperature_2m}°C • ${finalCity}`);
      } catch (err) {
        setWeatherStr("Weather service error");
      }
    };

    const handleIPFallback = async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.latitude && ipData.longitude) {
             const ipCity = ipData.city || ipData.region || "IP Location";
             await fetchWeatherForCoords(ipData.latitude, ipData.longitude, ipCity);
             return;
          }
        }
        setWeatherStr("Location service error");
      } catch (err) {
        setWeatherStr("Location service error");
      }
    };

    if (!navigator.geolocation) {
      handleIPFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await fetchWeatherForCoords(latitude, longitude);
      },
      async (err) => {
        console.warn("Geolocation access denied or failed, using IP fallback...", err);
        await handleIPFallback();
      },
      { timeout: 8000 }
    );
  }, []);

  return { weatherStr, isDay, condition: conditionStr, temp, city, precip };
}

