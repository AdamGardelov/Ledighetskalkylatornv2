import { differenceInDays, isWeekend, parseISO, format, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import { Holiday, getSwedishHolidays } from "./holidays";

export interface CalculationResult {
  totalDays: number;
  workingDays: number;
  holidays: Holiday[];
  holidaysInRange: Holiday[];
}

export function calculateLeaveDays(
  fromDate: Date | null,
  toDate: Date | null
): CalculationResult | null {
  if (!fromDate || !toDate) {
    return null;
  }

  if (fromDate > toDate) {
    return null;
  }

  const year = fromDate.getFullYear();
  const holidays = getSwedishHolidays(year);
  
  // Get holidays in the date range
  const holidaysInRange = holidays.filter((holiday) => {
    const holidayDate = parseISO(holiday.date);
    return holidayDate >= fromDate && holidayDate <= toDate;
  });

  // Calculate total days (inclusive)
  const totalDays = differenceInDays(toDate, fromDate) + 1;

  // Calculate working days (excluding weekends and holidays)
  let workingDays = 0;
  const currentDate = new Date(fromDate);
  
  while (currentDate <= toDate) {
    const isHoliday = holidaysInRange.some((h) =>
      isSameDay(parseISO(h.date), currentDate)
    );
    
    if (!isWeekend(currentDate) && !isHoliday) {
      workingDays++;
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    totalDays,
    workingDays,
    holidays,
    holidaysInRange,
  };
}

export function formatDateForInput(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDateDisplay(date: Date): string {
  return format(date, "yyyy-MM-dd", { locale: sv });
}

