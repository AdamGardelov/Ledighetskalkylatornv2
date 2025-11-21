import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const bgClass = theme === "dark" ? "bg-[#3C3D37]" : "bg-gray-200";
  const hoverClass = theme === "dark" ? "hover:bg-[#697565]" : "hover:bg-gray-300";

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 ${bgClass} ${hoverClass} rounded-full shadow-lg transition-colors duration-200 z-50`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        // Dark mode -> show flashbang icon
        <img
          src="/flashbang.png"
          alt="Flashbang ikon för mörkt läge"
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
        />
      ) : (
        // Light mode -> show moon icon
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
