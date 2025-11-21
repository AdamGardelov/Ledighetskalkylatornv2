import { useState } from "react";
import { CalculationResult } from "@/lib/dateUtils";
import { SeasonTheme } from "@/lib/seasons";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";

interface ResultDisplayProps {
  result: CalculationResult;
  seasonTheme: SeasonTheme;
}

export default function ResultDisplay({ result, seasonTheme }: ResultDisplayProps) {
  const [isDaysToTakeOffExpanded, setIsDaysToTakeOffExpanded] = useState(false);
  const [isDaysOffExpanded, setIsDaysOffExpanded] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const { theme } = useTheme();

  // Separate days into working days (to take off) and non-working days (already off)
  const workingDaysToTakeOff = result.allDays.filter((day) => day.isWorkingDay);
  const daysOff = result.allDays.filter((day) => !day.isWorkingDay);

  const handleCopy = async () => {
    const dateStrings = workingDaysToTakeOff
      .map(day => format(day.date, "yyyy-MM-dd", { locale: sv }))
      .join("\n");
    
    try {
      await navigator.clipboard.writeText(dateStrings);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy dates:", err);
    }
  };

  const cardBgClass = theme === "dark" ? "bg-[#3C3D37]" : "bg-gray-50";
  const cardBorderClass = theme === "dark" ? "border-[#697565]" : "border-gray-300";
  const textClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const textSecondaryClass = theme === "dark" ? "text-[#ECDFCC]/70" : "text-gray-600";

  // Get color classes based on season
  const getPrimaryColorClass = () => {
    switch (seasonTheme.season) {
      case "winter":
        return "text-blue-400";
      case "spring":
        return "text-pink-400";
      case "summer":
        return "text-yellow-400";
      case "christmas":
        return "text-red-400";
      default:
        return "text-orange-400";
    }
  };

  const getPrimaryHoverClass = () => {
    switch (seasonTheme.season) {
      case "winter":
        return "hover:text-blue-300";
      case "spring":
        return "hover:text-pink-300";
      case "summer":
        return "hover:text-yellow-300";
      case "christmas":
        return "hover:text-red-300";
      default:
        return "hover:text-orange-300";
    }
  };

  const getPrimaryBgClass = () => {
    switch (seasonTheme.season) {
      case "winter":
        return "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30";
      case "spring":
        return "bg-pink-500/20 border-pink-500/30 hover:bg-pink-500/30";
      case "summer":
        return "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30";
      case "christmas":
        return "bg-red-500/20 border-red-500/30 hover:bg-red-500/30";
      default:
        return "bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30";
    }
  };

  const getPrimaryTextClass = () => {
    switch (seasonTheme.season) {
      case "winter":
        return "text-blue-200";
      case "spring":
        return "text-pink-200";
      case "summer":
        return "text-yellow-200";
      case "christmas":
        return "text-red-200";
      default:
        return "text-orange-200";
    }
  };

  const getPrimaryTextSecondaryClass = () => {
    switch (seasonTheme.season) {
      case "winter":
        return "text-blue-300/80";
      case "spring":
        return "text-pink-300/80";
      case "summer":
        return "text-yellow-300/80";
      case "christmas":
        return "text-red-300/80";
      default:
        return "text-orange-300/80";
    }
  };

  return (
    <div className="mb-4 sm:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 items-start">
        {/* Dagar att ta ledigt Group */}
        <div className="space-y-2.5 sm:space-y-4">
          {/* Summary Card */}
          <div className={`${cardBgClass} rounded-lg p-3 sm:p-6 border ${cardBorderClass} shadow-lg`}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <h3 className={`text-sm sm:text-lg font-semibold ${textClass}`}>Dagar att ta ledigt</h3>
              <span className={`text-lg sm:text-2xl font-bold ${getPrimaryColorClass()}`}>{workingDaysToTakeOff.length}</span>
            </div>
            <p className={`text-xs sm:text-sm ${textSecondaryClass} mb-2 sm:mb-4`}>
              Arbetsdagar du behöver ta ledigt
            </p>
            <button
              onClick={() => setIsDaysToTakeOffExpanded(!isDaysToTakeOffExpanded)}
              className={`w-full flex items-center justify-between text-left text-sm ${getPrimaryColorClass()} ${getPrimaryHoverClass()} transition-colors`}
            >
              <span>{isDaysToTakeOffExpanded ? "Dölj" : "Visa"} alla dagar</span>
              <span className="text-lg">{isDaysToTakeOffExpanded ? "−" : "+"}</span>
            </button>
          </div>

          {/* Expanded Content */}
          {isDaysToTakeOffExpanded && (
            <div className={`${cardBgClass} rounded-lg p-3 sm:p-6 border ${cardBorderClass} shadow-lg`}>
              <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                <h4 className={`text-sm sm:text-md font-semibold ${textClass}`}>
                  Dagar att ta ledigt ({workingDaysToTakeOff.length})
                </h4>
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-full transition-colors ${
                    showCopied 
                      ? "bg-green-500/20 text-green-500" 
                      : `${getPrimaryBgClass()} ${getPrimaryTextClass()} hover:bg-opacity-30`
                  }`}
                  title="Kopiera datum"
                >
                  {showCopied ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {workingDaysToTakeOff.map((day) => (
                  <div
                    key={day.dateString}
                    className={`${getPrimaryBgClass()} rounded-lg p-3 transition-colors`}
                  >
                    <div className={`text-sm font-medium ${getPrimaryTextClass()} capitalize`}>
                      {format(day.date, "EEEE", { locale: sv })}
                    </div>
                    <div className={`text-xs ${getPrimaryTextSecondaryClass()} mt-1`}>
                      {format(day.date, "d MMM yyyy", { locale: sv })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lediga dagar Group */}
        <div className="space-y-2.5 sm:space-y-4">
          {/* Summary Card */}
          <div className={`${cardBgClass} rounded-lg p-3 sm:p-6 border ${cardBorderClass} shadow-lg`}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <h3 className={`text-sm sm:text-lg font-semibold ${textClass}`}>Lediga dagar</h3>
              <span className={`text-lg sm:text-2xl font-bold text-blue-400`}>{daysOff.length}</span>
            </div>
            <p className={`text-xs sm:text-sm ${textSecondaryClass} mb-2 sm:mb-4`}>
              Helger och röda dagar (redan lediga)
            </p>
            <button
              onClick={() => setIsDaysOffExpanded(!isDaysOffExpanded)}
              className="w-full flex items-center justify-between text-left text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>{isDaysOffExpanded ? "Dölj" : "Visa"} alla dagar</span>
              <span className="text-lg">{isDaysOffExpanded ? "−" : "+"}</span>
            </button>
          </div>

          {/* Expanded Content */}
          {isDaysOffExpanded && (
            <div className={`${cardBgClass} rounded-lg p-3 sm:p-6 border ${cardBorderClass} shadow-lg`}>
              <h4 className={`text-sm sm:text-md font-semibold ${textClass} mb-2.5 sm:mb-4`}>
                Lediga dagar ({daysOff.length})
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {daysOff.map((day) => (
                  <div
                    key={day.dateString}
                    className={`rounded-lg p-3 border transition-colors ${
                      day.isHoliday
                        ? "bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                        : "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30"
                    }`}
                  >
                    <div className="text-sm font-medium text-white capitalize">
                      {format(day.date, "EEEE", { locale: sv })}
                    </div>
                    <div className="text-xs text-gray-300/80 mt-1">
                      {format(day.date, "d MMM yyyy", { locale: sv })}
                    </div>
                    {day.isHoliday && day.holidayName && (
                      <div className="text-xs text-red-300 mt-1 font-semibold">
                        🎉 {day.holidayName}
                      </div>
                    )}
                    {day.isWeekend && !day.isHoliday && (
                      <div className="text-xs text-blue-300 mt-1">
                        Helg
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
