import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { useThemeEngine } from "../hooks/useThemeEngine";

export default function GreetingSection() {
  const { user, settings } = useStore();
  const { currentTheme } = useThemeEngine();
  const [greeting, setGreeting] = useState("");
  const [subGreeting, setSubGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let mainG = "";
      let subG = "";

      if (currentTheme === "valentine") {
        mainG = "Happy Valentine's Day ❤️";
        subG = "Have a lovely day!";
      } else if (currentTheme === "thadingyut") {
        mainG = "Happy Thadingyut Festival 🏮";
        subG = "May you be blessed with peace and joy.";
      } else if (currentTheme === "thingyan") {
        mainG = "Happy Thingyan Festival 💦";
        subG = "Have a wonderful splash!";
      } else if (currentTheme === "christmas") {
        mainG = "Merry Christmas 🎄";
        subG = "Wishing you joy and wonderful moments.";
      } else if (currentTheme === "custom") {
        const theme = (settings.customThemes || []).find(t => t.id === settings.selectedCustomThemeId || t.id === settings.themeOverride);
        const themeSymbol = theme?.icon && theme.icon.length <= 3 ? theme.icon : "🎨";
        mainG = theme ? `${theme.name} Active ${themeSymbol}` : "Custom Theme Active ✨";
        subG = "Enjoy your personalized workspace styling!";
      } else {
        if (hour < 12) {
          mainG = `Good Morning, ${user.name.split(' ')[0]} ☀️`;
          subG = "Ready to start your productive day?";
        } else if (hour < 18) {
          mainG = `Good Afternoon 🌤️`;
          subG = "Hope your day is going well.";
        } else {
          mainG = `Good Evening 🌙`;
          subG = "Don't forget to check out before leaving.";
        }
      }

      setGreeting(mainG);
      setSubGreeting(subG);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [user.name, currentTheme]);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        {greeting}
      </h1>
      <p className="text-slate-400 font-medium mt-1">
        {subGreeting}
      </p>
    </div>
  );
}
