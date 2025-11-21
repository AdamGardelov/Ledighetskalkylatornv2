import { useState, useEffect, useRef } from "react";
import { calculateLeaveDays } from "@/lib/dateUtils";
import HolidayList from "@/components/HolidayList";
import ResultDisplay from "@/components/ResultDisplay";
import SearchHistory from "@/components/SearchHistory";
import ThemeToggle from "@/components/ThemeToggle";
import CookieConsent from "@/components/CookieConsent";
import { getSwedishHolidays } from "@/lib/holidays";
import { useTheme } from "@/contexts/ThemeContext";
import { getCurrentSeason, getSeasonTheme } from "@/lib/seasons";
import { setCookie, hasConsentedToCookies } from "@/lib/cookies";
import { addToSearchHistory } from "@/lib/searchHistory";

function App() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [result, setResult] = useState<ReturnType<typeof calculateLeaveDays>>(null);
  const [searchHistoryRefresh, setSearchHistoryRefresh] = useState(0);
  const [currentYear] = useState(new Date().getFullYear());
  const holidays = getSwedishHolidays(currentYear);
  const { theme } = useTheme();
  
  // Track previous values to avoid recalculating on navigation
  const prevFromDate = useRef<string>("");
  const prevToDate = useRef<string>("");
  
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

  // Function to perform calculation
  const performCalculation = () => {
    if (!fromDate || !toDate) {
      setResult(null);
      return;
    }

    // Validate that dates are in correct format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
      setResult(null);
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Check if dates are valid
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      setResult(null);
      return;
    }

    if (from > to) {
      setResult(null);
      return;
    }

    const calculation = calculateLeaveDays(from, to);
    setResult(calculation);
    
    // Save to search history and trigger refresh
    addToSearchHistory(fromDate, toDate);
    setSearchHistoryRefresh(Date.now());
  };

  // Auto-calculate when both dates are set and valid, and actually changed
  useEffect(() => {
    // Only calculate if dates actually changed
    if (fromDate === prevFromDate.current && toDate === prevToDate.current) {
      return;
    }

    // Update refs
    prevFromDate.current = fromDate;
    prevToDate.current = toDate;

    // Don't calculate immediately - wait for blur
    // This prevents calculation during month navigation
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

  const handleSelectSearch = (selectedFromDate: string, selectedToDate: string) => {
    setFromDate(selectedFromDate);
    setToDate(selectedToDate);
    // Calculation will happen automatically via useEffect
  };

  const bgClass = theme === "dark" ? "bg-[#1E201E]" : "bg-white";
  const textClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const textSecondaryClass = theme === "dark" ? "text-[#ECDFCC]/80" : "text-gray-600";
  const inputBgClass = theme === "dark" ? "bg-[#3C3D37]" : "bg-gray-100";
  const inputBorderClass = theme === "dark" ? "border-[#697565]" : "border-gray-300";
  const inputTextClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const focusRingClass = getFocusRingClass();

  return (
    <main className={`min-h-screen ${bgClass} ${textClass} flex flex-col p-2.5 sm:p-4`}>
      <ThemeToggle />
      <CookieConsent />
      
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col pt-12 sm:pt-4">
        <div className="flex-1 flex flex-col justify-center">
          {/* Header text */}
          <div className="text-center mb-4 sm:mb-8 px-12 sm:px-0">
            <p className={`text-sm sm:text-lg ${textSecondaryClass} mb-2 leading-tight`}>
              Fyll i från och tilldatum för att ta reda på antal dagar du behöver ta ledigt <span className="text-lg sm:text-2xl">{seasonTheme.emoji}</span>
            </p>
          </div>

        {/* Date inputs */}
        <div className="flex flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <label htmlFor="fromDate" className={`block text-xs font-medium mb-1 ${textSecondaryClass}`}>
              Från
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => {
                // Only update if a valid date string is provided
                const value = e.target.value;
                if (value === "" || value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  setFromDate(value);
                }
              }}
              onBlur={performCalculation}
              className={`w-full px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-base ${inputBgClass} border ${inputBorderClass} rounded-lg ${inputTextClass} focus:outline-none focus:ring-2 ${focusRingClass} focus:border-transparent min-h-[36px] sm:min-h-[44px]`}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="toDate" className={`block text-xs font-medium mb-1 ${textSecondaryClass}`}>
              Till
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => {
                // Only update if a valid date string is provided
                const value = e.target.value;
                if (value === "" || value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  setToDate(value);
                }
              }}
              onBlur={performCalculation}
              className={`w-full px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-base ${inputBgClass} border ${inputBorderClass} rounded-lg ${inputTextClass} focus:outline-none focus:ring-2 ${focusRingClass} focus:border-transparent min-h-[36px] sm:min-h-[44px]`}
            />
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
