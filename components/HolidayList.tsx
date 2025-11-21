"use client";

import { useState } from "react";
import { Holiday } from "@/lib/holidays";
import { parseISO, format } from "date-fns";
import { sv } from "date-fns/locale";

interface HolidayListProps {
  holidays: Holiday[];
  currentYear: number;
}

export default function HolidayList({ holidays, currentYear }: HolidayListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter holidays that are in the future from today
  const today = new Date();
  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayDate = parseISO(holiday.date);
    return holidayDate >= today;
  });

  return (
    <div className="mt-8 bg-gray-800 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-semibold text-white">
          Röda dagar kvar {currentYear} ({upcomingHolidays.length}) 🥳
        </h2>
        <span className="text-white text-xl">
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
                className="bg-gray-700 rounded p-3 text-white"
              >
                <div className="font-medium">
                  {format(holidayDate, "yyyy-MM-dd", { locale: sv })} - {holiday.name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

