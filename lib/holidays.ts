// Swedish holidays data
// This will later be moved to Strapi CMS

export interface Holiday {
  date: string; // YYYY-MM-DD format
  name: string;
}

export const getSwedishHolidays = (year: number): Holiday[] => {
  const holidays: Holiday[] = [
    // Fixed holidays
    { date: `${year}-01-01`, name: "Nyårsdagen" },
    { date: `${year}-01-06`, name: "Trettondedag jul" },
    { date: `${year}-05-01`, name: "Första maj" },
    { date: `${year}-06-06`, name: "Sveriges nationaldag" },
    { date: `${year}-12-24`, name: "Julafton" },
    { date: `${year}-12-25`, name: "Juldagen" },
    { date: `${year}-12-26`, name: "Annandag jul" },
    { date: `${year}-12-31`, name: "Nyårsafton" },
  ];

  // Calculate Easter (using simplified algorithm)
  const easter = calculateEaster(year);
  const easterDate = new Date(easter.year, easter.month - 1, easter.day);
  
  // Add Easter-related holidays
  const goodFriday = new Date(easterDate);
  goodFriday.setDate(easterDate.getDate() - 2);
  holidays.push({
    date: formatDate(goodFriday),
    name: "Långfredagen",
  });

  const easterMonday = new Date(easterDate);
  easterMonday.setDate(easterDate.getDate() + 1);
  holidays.push({
    date: formatDate(easterMonday),
    name: "Annandag påsk",
  });

  const ascensionDay = new Date(easterDate);
  ascensionDay.setDate(easterDate.getDate() + 39);
  holidays.push({
    date: formatDate(ascensionDay),
    name: "Kristi himmelsfärdsdag",
  });

  const whitMonday = new Date(easterDate);
  whitMonday.setDate(easterDate.getDate() + 50);
  holidays.push({
    date: formatDate(whitMonday),
    name: "Annandag pingst",
  });

  // Midsummer (always on a Saturday between June 20-26)
  const midsummer = getMidsummerDay(year);
  holidays.push({
    date: formatDate(midsummer),
    name: "Midsommarafton",
  });

  const midsummerDay = new Date(midsummer);
  midsummerDay.setDate(midsummer.getDate() + 1);
  holidays.push({
    date: formatDate(midsummerDay),
    name: "Midsommardagen",
  });

  // All Saints' Day (always on a Saturday between October 31 - November 6)
  const allSaints = getAllSaintsDay(year);
  holidays.push({
    date: formatDate(allSaints),
    name: "Alla helgons dag",
  });

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
};

// Calculate Easter using the algorithm by J.M. Oudin
function calculateEaster(year: number): { year: number; month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
}

// Get Midsummer Day (Saturday between June 20-26)
function getMidsummerDay(year: number): Date {
  const june20 = new Date(year, 5, 20); // Month is 0-indexed
  const dayOfWeek = june20.getDay();
  const daysToAdd = (6 - dayOfWeek) % 7; // Days to next Saturday
  const midsummer = new Date(june20);
  midsummer.setDate(20 + daysToAdd);
  return midsummer;
}

// Get All Saints' Day (Saturday between October 31 - November 6)
function getAllSaintsDay(year: number): Date {
  const oct31 = new Date(year, 9, 31); // Month is 0-indexed
  const dayOfWeek = oct31.getDay();
  const daysToAdd = (6 - dayOfWeek) % 7; // Days to next Saturday
  const allSaints = new Date(oct31);
  allSaints.setDate(31 + daysToAdd);
  return allSaints;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

