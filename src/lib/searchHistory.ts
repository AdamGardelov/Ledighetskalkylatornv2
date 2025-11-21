import { getCookie, setCookie, hasConsentedToCookies } from "./cookies";

export interface SearchHistoryItem {
  fromDate: string;
  toDate: string;
  timestamp: number;
}

const MAX_HISTORY_ITEMS = 5;
const HISTORY_COOKIE_NAME = "search_history";

export function getSearchHistory(): SearchHistoryItem[] {
  if (!hasConsentedToCookies()) {
    return [];
  }

  const historyJson = getCookie(HISTORY_COOKIE_NAME);
  if (!historyJson) {
    return [];
  }

  try {
    const history = JSON.parse(historyJson) as SearchHistoryItem[];
    // Sort by timestamp (newest first) and limit to MAX_HISTORY_ITEMS
    return history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function addToSearchHistory(fromDate: string, toDate: string): void {
  if (!hasConsentedToCookies() || !fromDate || !toDate) {
    return;
  }

  const history = getSearchHistory();
  
  // Remove duplicates (same from/to dates)
  const filtered = history.filter(
    (item) => !(item.fromDate === fromDate && item.toDate === toDate)
  );

  // Add new search at the beginning
  const newHistory: SearchHistoryItem[] = [
    {
      fromDate,
      toDate,
      timestamp: Date.now(),
    },
    ...filtered,
  ].slice(0, MAX_HISTORY_ITEMS);

  setCookie(HISTORY_COOKIE_NAME, JSON.stringify(newHistory), 365);
}

export function clearSearchHistory(): void {
  if (hasConsentedToCookies()) {
    setCookie(HISTORY_COOKIE_NAME, "[]", 365);
  }
}

