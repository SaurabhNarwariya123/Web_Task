export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-4 flex-shrink-0">
      {/* Notifications */}
      <div className="flex items-center gap-3">
        {/* Mail */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">2</span>
        </button>

        {/* Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">1</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-200" />

      {/* User profile */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" fill="#9CA3AF"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#9CA3AF"/>
            </svg>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-800">Saurabh Narwariya</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
      </div>
    </header>
  );
}
