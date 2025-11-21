// Seasons in chronological order throughout the year
export type Season = "winter" | "spring" | "summer" | "fall" | "halloween" | "christmas";

export interface SeasonTheme {
  season: Season;
  name: string;
  emoji: string;
  primaryColor: string;
  primaryColorHover: string;
  primaryColorLight: string;
  accentColor: string;
}

export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Halloween: October 1 - October 31 (takes priority over fall)
  if (month === 10) {
    return "halloween";
  }

  // Christmas: December 1 - December 31 (takes priority over winter)
  if (month === 12) {
    return "christmas";
  }

  // Winter: December 22 - March 19 (approximately, but Christmas takes Dec 1-31)
  if (month === 1 || month === 2) return "winter";
  if (month === 3 && day < 20) return "winter";

  // Spring: March 20 - June 20
  if (month === 3 && day >= 20) return "spring";
  if (month === 4 || month === 5) return "spring";
  if (month === 6 && day < 21) return "spring";

  // Summer: June 21 - September 22
  if (month === 6 && day >= 21) return "summer";
  if (month === 7 || month === 8) return "summer";
  if (month === 9 && day < 23) return "summer";

  // Fall: September 23 - November 30 (Halloween takes October)
  if (month === 9 && day >= 23) return "fall";
  if (month === 11) return "fall";

  // Default to winter for December 1-21 (before Christmas)
  return "winter";
}

export function getSeasonTheme(season: Season): SeasonTheme {
  // Themes in chronological order
  const themes: Record<Season, SeasonTheme> = {
    winter: {
      season: "winter",
      name: "Vinter",
      emoji: "❄️",
      primaryColor: "bg-blue-500 dark:bg-blue-600",
      primaryColorHover: "hover:bg-blue-600 dark:hover:bg-blue-700",
      primaryColorLight: "bg-blue-500/20",
      accentColor: "text-blue-400",
    },
    spring: {
      season: "spring",
      name: "Vår",
      emoji: "🌸",
      primaryColor: "bg-pink-500 dark:bg-pink-600",
      primaryColorHover: "hover:bg-pink-600 dark:hover:bg-pink-700",
      primaryColorLight: "bg-pink-500/20",
      accentColor: "text-pink-400",
    },
    summer: {
      season: "summer",
      name: "Sommar",
      emoji: "☀️",
      primaryColor: "bg-yellow-500 dark:bg-yellow-600",
      primaryColorHover: "hover:bg-yellow-600 dark:hover:bg-yellow-700",
      primaryColorLight: "bg-yellow-500/20",
      accentColor: "text-yellow-400",
    },
    fall: {
      season: "fall",
      name: "Höst",
      emoji: "🍂",
      primaryColor: "bg-orange-500 dark:bg-orange-600",
      primaryColorHover: "hover:bg-orange-600 dark:hover:bg-orange-700",
      primaryColorLight: "bg-orange-500/20",
      accentColor: "text-orange-400",
    },
    halloween: {
      season: "halloween",
      name: "Halloween",
      emoji: "🎃",
      primaryColor: "bg-orange-500 dark:bg-orange-600",
      primaryColorHover: "hover:bg-orange-600 dark:hover:bg-orange-700",
      primaryColorLight: "bg-orange-500/20",
      accentColor: "text-orange-400",
    },
    christmas: {
      season: "christmas",
      name: "Jul",
      emoji: "🎄",
      primaryColor: "bg-red-500 dark:bg-red-600",
      primaryColorHover: "hover:bg-red-600 dark:hover:bg-red-700",
      primaryColorLight: "bg-red-500/20",
      accentColor: "text-red-400",
    },
  };

  return themes[season];
}
