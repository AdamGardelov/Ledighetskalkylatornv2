import { differenceInDays, isWeekend, parseISO, format, isSameDay, eachDayOfInterval } from "date-fns";
import { sv } from "date-fns/locale";
import { Holiday, getSwedishHolidays } from "./holidays";

export interface DayInfo {
  date: Date;
  dateString: string;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isWorkingDay: boolean;
}

export interface CalculationResult {
  totalDays: number;
  workingDays: number;
  daysToTakeOff: number; // Total days including weekends and holidays
  holidays: Holiday[];
  holidaysInRange: Holiday[];
  allDays: DayInfo[];
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

  // Get all days in the interval
  const allDaysInRange = eachDayOfInterval({ start: fromDate, end: toDate });
  
  // Create day info for each day
  const allDays: DayInfo[] = allDaysInRange.map((date) => {
    const isWeekendDay = isWeekend(date);
    const holiday = holidaysInRange.find((h) => isSameDay(parseISO(h.date), date));
    const isHolidayDay = !!holiday;
    const isWorkingDay = !isWeekendDay && !isHolidayDay;

    return {
      date,
      dateString: format(date, "yyyy-MM-dd"),
      isWeekend: isWeekendDay,
      isHoliday: isHolidayDay,
      holidayName: holiday?.name,
      isWorkingDay,
    };
  });

  // Calculate working days (excluding weekends and holidays)
  const workingDays = allDays.filter((day) => day.isWorkingDay).length;
  
  // Days to take off = total days (all days in the range)
  const daysToTakeOff = totalDays;

  return {
    totalDays,
    workingDays,
    daysToTakeOff,
    holidays,
    holidaysInRange,
    allDays,
  };
}

export function formatDateForInput(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDateDisplay(date: Date): string {
  return format(date, "yyyy-MM-dd", { locale: sv });
}

export function formatDateLong(date: Date): string {
  return format(date, "EEEE d MMMM yyyy", { locale: sv });
}
