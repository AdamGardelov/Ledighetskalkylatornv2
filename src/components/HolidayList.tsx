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
    <div className={`mt-8 ${bgClass} rounded-lg p-4 border ${theme === "dark" ? "border-[#697565]" : "border-gray-300"}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className={`text-lg font-semibold ${textClass}`}>
          Röda dagar kvar {currentYear} ({upcomingHolidays.length}) 🥳
        </h2>
        <span className={`${textClass} text-xl`}>
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
                className={`${itemBgClass} ${itemHoverClass} rounded-lg p-2 border ${borderClass} transition-colors`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-medium ${textClass}`}>
                    {format(holidayDate, "yyyy-MM-dd", { locale: sv })} - {holiday.name}
                  </span>
                  <span className={textClass}>🎉</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
