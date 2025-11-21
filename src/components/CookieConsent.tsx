import { useState, useEffect } from "react";
import { setCookieConsent, hasConsentedToCookies } from "@/lib/cookies";
import { useTheme } from "@/contexts/ThemeContext";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Only show if user hasn't consented yet
    if (!hasConsentedToCookies()) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setShow(false);
  };

  if (!show) return null;

  const bgClass = theme === "dark" ? "bg-[#3C3D37]" : "bg-gray-100";
  const textClass = theme === "dark" ? "text-[#ECDFCC]" : "text-gray-900";
  const borderClass = theme === "dark" ? "border-[#697565]" : "border-gray-300";
  const buttonPrimaryClass = theme === "dark" ? "bg-[#697565] hover:bg-[#697565]/80" : "bg-blue-500 hover:bg-blue-600";
  const buttonSecondaryClass = theme === "dark" ? "bg-[#1E201E] hover:bg-[#3C3D37]" : "bg-gray-200 hover:bg-gray-300";

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] p-3 sm:p-4">
      <div className={`max-w-4xl mx-auto ${bgClass} ${textClass} rounded-lg border ${borderClass} shadow-lg p-4 sm:p-6`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Cookie-inställningar</h3>
            <p className="text-xs sm:text-sm">
              Vi använder cookies för att komma ihåg din prefererade tema och dina senaste sökningar. 
              Detta hjälper oss att förbättra din upplevelse på webbplatsen.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className={`flex-1 sm:flex-none px-4 py-2 ${buttonSecondaryClass} ${textClass} rounded-lg text-sm font-medium transition-colors`}
            >
              Avvisa
            </button>
            <button
              onClick={handleAccept}
              className={`flex-1 sm:flex-none px-4 py-2 ${buttonPrimaryClass} text-white rounded-lg text-sm font-medium transition-colors`}
            >
              Godkänn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

