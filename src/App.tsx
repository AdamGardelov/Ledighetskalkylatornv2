import { useState, useEffect } from "react";
import { calculateLeaveDays } from "@/lib/dateUtils";
import HolidayList from "@/components/HolidayList";
import ResultDisplay from "@/components/ResultDisplay";
import SearchHistory from "@/components/SearchHistory";
import ThemeToggle from "@/components/ThemeToggle";
import CookieConsent from "@/components/CookieConsent";
import { getSwedishHolidays } from "@/lib/holidays";
import { useTheme } from "@/contexts/ThemeContext";
import { getCurrentSeason, getSeasonTheme } from "@/lib/seasons";
import { getCookie, setCookie, hasConsentedToCookies } from "@/lib/cookies";
import { addToSearchHistory } from "@/lib/searchHistory";

function App() {
  const [fromDate, setFromDate] = useState<string>(() => {
    // Load from cookies if consent given
    if (hasConsentedToCookies()) {
      return getCookie("fromDate") || "";
    }
    return "";
  });
  const [toDate, setToDate] = useState<string>(() => {
    // Load from cookies if consent given
    if (hasConsentedToCookies()) {
      return getCookie("toDate") || "";
    }
    return "";
  });
  const [result, setResult] = useState<ReturnType<typeof calculateLeaveDays>>(null);
  const [searchHistoryRefresh, setSearchHistoryRefresh] = useState(0);
  const [currentYear] = useState(new Date().getFullYear());
  const holidays = getSwedishHolidays(currentYear);
  const { theme } = useTheme();
  
  // Get current season theme
  const seasonTheme = getSeasonTheme(getCurrentSeason());

  // Save dates to cookies when they change (if consent given)
  useEffect(() => {
    if (hasConsentedToCookies()) {
      if (fromDate) {
        setCookie("fromDate", fromDate);
      }
      if (toDate) {
        setCookie("toDate", toDate);
      }
    }
  }, [fromDate, toDate]);

  // Get focus ring color based on season
  const getFocusRingClass = () => {
    switch (seasonTheme.season) {
      case "winter":
        return "focus:ring-blue-500";
      case "spring":
        return "focus:ring-pink-500";
      case "summer":
        return "focus:ring-yellow-500";
      case "christmas":
        return "focus:ring-red-500";
      default:
        return "focus:ring-orange-500";
    }
  };

  const handleCalculate = () => {
    if (!fromDate || !toDate) {
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      alert("Från-datumet måste vara före eller samma som till-datumet");
      return;
    }

    const calculation = calculateLeaveDays(from, to);
    setResult(calculation);
    
    // Save to search history and trigger refresh
    addToSearchHistory(fromDate, toDate);
    setSearchHistoryRefresh(Date.now());
  };

  const handleSelectSearch = (selectedFromDate: string, selectedToDate: string) => {
    setFromDate(selectedFromDate);
    setToDate(selectedToDate);
    
    // Automatically calculate when selecting from history
    const from = new Date(selectedFromDate);
    const to = new Date(selectedToDate);
    const calculation = calculateLeaveDays(from, to);
    setResult(calculation);
  };

  const bgClass = theme === "dark" ? "bg-[#1E201E]" : "bg-white";
  const textClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const textSecondaryClass = theme === "dark" ? "text-[#ECDFCC]/80" : "text-gray-600";
  const inputBgClass = theme === "dark" ? "bg-[#3C3D37]" : "bg-gray-100";
  const inputBorderClass = theme === "dark" ? "border-[#697565]" : "border-gray-300";
  const inputTextClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const focusRingClass = getFocusRingClass();

  return (
    <main className={`min-h-screen ${bgClass} ${textClass} flex flex-col p-3 sm:p-4`}>
      <ThemeToggle />
      <CookieConsent />
      
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          {/* Header text */}
          <div className="text-center mb-6 sm:mb-8">
            <p className={`text-base sm:text-lg ${textSecondaryClass} mb-2 px-2`}>
              Fyll i från och tilldatum för att ta reda på antal dagar du behöver ta ledigt <span className="text-xl sm:text-2xl">{seasonTheme.emoji}</span>
            </p>
          </div>

        {/* Date inputs and calculate button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="fromDate" className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
              Från datum
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={`w-full px-4 py-2 ${inputBgClass} border ${inputBorderClass} rounded-lg ${inputTextClass} focus:outline-none focus:ring-2 ${focusRingClass} focus:border-transparent`}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="toDate" className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
              Till datum
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={`w-full px-4 py-2 ${inputBgClass} border ${inputBorderClass} rounded-lg ${inputTextClass} focus:outline-none focus:ring-2 ${focusRingClass} focus:border-transparent`}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-2 ${seasonTheme.primaryColor} ${seasonTheme.primaryColorHover} text-white font-semibold rounded-lg transition-colors duration-200 text-base`}
            >
              Beräkna
            </button>
          </div>
        </div>

        {/* Result display */}
        {result && <ResultDisplay result={result} seasonTheme={seasonTheme} />}

        {/* Search History */}
        <SearchHistory onSelectSearch={handleSelectSearch} refreshTrigger={searchHistoryRefresh} />

          {/* Holiday list */}
          <HolidayList holidays={holidays} currentYear={currentYear} />
        </div>

        {/* Footer - Always at bottom */}
        <footer className={`pt-8 sm:pt-12 pb-4 text-center ${textSecondaryClass} text-xs sm:text-sm space-y-2`}>
          <div>© {currentYear} - Ledighetskalkylatorn.</div>
          <div>
            <a
              href="https://github.com/AdamGardelov"
              target="_blank"
              rel="noopener noreferrer"
              className={`${textSecondaryClass} ${theme === "dark" ? "hover:text-[#ECDFCC]" : "hover:text-gray-900"} transition-colors underline`}
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default App;
