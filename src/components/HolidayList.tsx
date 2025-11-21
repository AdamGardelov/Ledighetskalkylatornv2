import { useState } from "react";
import { Holiday } from "@/lib/holidays";
import { parseISO, format } from "date-fns";
import { sv } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";

interface HolidayListProps {
  holidays: Holiday[];
  currentYear: number;
}

export default function HolidayList({ holidays, currentYear }: HolidayListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  // Filter holidays that are in the future from today
  const today = new Date();
  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayDate = parseISO(holiday.date);
    return holidayDate >= today;
  });

  const bgClass = theme === "dark" ? "bg-[#3C3D37]" : "bg-gray-100";
  const textClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const textSecondaryClass = theme === "dark" ? "text-[#ECDFCC]/70" : "text-gray-600";
  const borderClass = theme === "dark" ? "border-[#697565]" : "border-gray-300";

  return (
    <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-4">
      {/* Summary Card */}
      <div className={`${bgClass} rounded-lg p-3 sm:p-6 border ${borderClass} shadow-lg`}>
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <h3 className={`text-sm sm:text-lg font-semibold ${textClass}`}>Röda dagar kvar {currentYear}</h3>
          <span className="text-lg sm:text-2xl font-bold text-red-400">{upcomingHolidays.length}</span>
        </div>
        <p className={`text-xs sm:text-sm ${textSecondaryClass} mb-2 sm:mb-4`}>
          Kommande röda dagar 🥳
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <span>{isExpanded ? "Dölj" : "Visa"} dagar</span>
          <span className="text-lg">{isExpanded ? "−" : "+"}</span>
        </button>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className={`${bgClass} rounded-lg p-3 sm:p-6 border ${borderClass} shadow-lg`}>
          <h4 className={`text-sm sm:text-md font-semibold ${textClass} mb-2.5 sm:mb-4`}>
            Röda dagar kvar {currentYear} ({upcomingHolidays.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {upcomingHolidays.map((holiday) => {
              const holidayDate = parseISO(holiday.date);
              return (
                <div
                  key={holiday.date}
                  className="rounded-lg p-3 border transition-colors bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                >
                  <div className="text-sm font-medium text-white capitalize">
                    {format(holidayDate, "EEEE", { locale: sv })}
                  </div>
                  <div className="text-xs text-gray-300/80 mt-1">
                    {format(holidayDate, "d MMM yyyy", { locale: sv })}
                  </div>
                  <div className="text-xs text-red-300 mt-1 font-semibold">
                    🎉 {holiday.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
