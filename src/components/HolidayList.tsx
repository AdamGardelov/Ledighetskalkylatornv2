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
  const borderClass = theme === "dark" ? "border-[#697565]" : "border-gray-300";
  const itemBgClass = theme === "dark" ? "bg-[#1E201E]" : "bg-white";
  const itemHoverClass = theme === "dark" ? "hover:bg-[#3C3D37]" : "hover:bg-gray-50";

  return (
    <div className={`mt-6 sm:mt-8 ${bgClass} rounded-lg p-3 sm:p-4 border ${theme === "dark" ? "border-[#697565]" : "border-gray-300"}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left gap-2"
      >
        <h2 className={`text-base sm:text-lg font-semibold ${textClass} truncate`}>
          Röda dagar kvar {currentYear} ({upcomingHolidays.length}) 🥳
        </h2>
        <span className={`${textClass} text-lg sm:text-xl flex-shrink-0`}>
          {isExpanded ? "−" : "+"}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-2">
          {upcomingHolidays.map((holiday) => {
            const holidayDate = parseISO(holiday.date);
            return (
              <div
                key={holiday.date}
                className={`${itemBgClass} ${itemHoverClass} rounded-lg p-3 sm:p-2 border ${borderClass} transition-colors`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-1 sm:gap-0">
                  <span className={`font-medium ${textClass} text-sm sm:text-base break-words`}>
                    <span className="text-xs sm:text-sm font-normal">{format(holidayDate, "yyyy-MM-dd", { locale: sv })}</span> - {holiday.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
