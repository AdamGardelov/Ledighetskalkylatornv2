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

  return (
    <div className={`mt-3 sm:mt-8 ${bgClass} rounded-lg p-2.5 sm:p-4 border ${theme === "dark" ? "border-[#697565]" : "border-gray-300"}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left gap-2"
      >
        <h2 className={`text-sm sm:text-lg font-semibold ${textClass} truncate`}>
          Röda dagar kvar {currentYear} ({upcomingHolidays.length}) 🥳
        </h2>
        <span className={`${textClass} text-base sm:text-xl flex-shrink-0`}>
          {isExpanded ? "−" : "+"}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
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
      )}
    </div>
  );
}
