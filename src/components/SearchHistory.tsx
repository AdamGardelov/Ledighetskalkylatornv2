import { useState, useEffect } from "react";
import { SearchHistoryItem, getSearchHistory, clearSearchHistory } from "@/lib/searchHistory";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface SearchHistoryProps {
  onSelectSearch: (fromDate: string, toDate: string) => void;
  refreshTrigger?: number;
}

export default function SearchHistory({ onSelectSearch, refreshTrigger }: SearchHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>(getSearchHistory());
  const { theme } = useTheme();

  // Refresh history when refreshTrigger changes or when expanded
  useEffect(() => {
    setHistory(getSearchHistory());
  }, [refreshTrigger, isExpanded]);

  const handleClear = () => {
    clearSearchHistory();
    setHistory([]);
  };

  const handleSelect = (item: SearchHistoryItem) => {
    onSelectSearch(item.fromDate, item.toDate);
  };

  if (history.length === 0) {
    return null;
  }

  const bgClass = theme === "dark" ? "bg-[#3C3D37]" : "bg-gray-100";
  const textClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const borderClass = theme === "dark" ? "border-[#697565]" : "border-gray-300";
  const itemBgClass = theme === "dark" ? "bg-[#1E201E]" : "bg-white";
  const itemHoverClass = theme === "dark" ? "hover:bg-[#3C3D37]" : "hover:bg-gray-50";

  return (
    <div className={`mt-3 sm:mt-6 ${bgClass} rounded-lg p-2.5 sm:p-4 border ${borderClass}`}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center justify-between text-left min-w-0"
        >
          <h2 className={`text-sm sm:text-lg font-semibold ${textClass} truncate`}>
            Senaste sökningar ({history.length})
          </h2>
          <span className={`${textClass} text-base sm:text-xl flex-shrink-0 ml-2`}>
            {isExpanded ? "−" : "+"}
          </span>
        </button>
        {isExpanded && (
          <button
            onClick={handleClear}
            className={`ml-2 sm:ml-4 text-xs sm:text-sm ${theme === "dark" ? "text-[#ECDFCC]/60 hover:text-[#ECDFCC]" : "text-gray-500 hover:text-gray-700"} transition-colors flex-shrink-0`}
          >
            Rensa
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
          {history.map((item) => {
            const fromDate = new Date(item.fromDate);
            const toDate = new Date(item.toDate);
            const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            return (
              <button
                key={`${item.fromDate}-${item.toDate}-${item.timestamp}`}
                onClick={() => handleSelect(item)}
                className={`w-full ${itemBgClass} ${itemHoverClass} rounded-lg p-2.5 sm:p-3 border ${borderClass} transition-colors text-left`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${textClass} text-sm sm:text-base break-words`}>
                      {format(fromDate, "d MMM", { locale: sv })} - {format(toDate, "d MMM yyyy", { locale: sv })}
                    </div>
                    <div className={`text-xs mt-1 ${theme === "dark" ? "text-[#ECDFCC]/60" : "text-gray-500"}`}>
                      {daysDiff} dagar
                    </div>
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-[#ECDFCC]/40" : "text-gray-400"} sm:ml-4 flex-shrink-0`}>
                    {format(new Date(item.timestamp), "d MMM", { locale: sv })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

